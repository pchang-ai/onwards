"use server";

import { DayNews, Podcast, XAccount, dailyNewsData, podcastsData, xFeedData, getRelativeDate } from "../pulseData";

// Helper to decode HTML entities
function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface RawArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

// Regex-based RSS news parser
function parseRssFeeds(xmlText: string, defaultSource: string): RawArticle[] {
  const articles: RawArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const content = match[1];

    let title = "";
    const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/);
    if (titleMatch) title = cleanText(titleMatch[1]);

    let link = "";
    const linkMatch = content.match(/<link>([\s\S]*?)<\/link>/);
    if (linkMatch) link = cleanText(linkMatch[1]);

    let description = "";
    const descMatch = content.match(/<description>([\s\S]*?)<\/description>/);
    if (descMatch) description = cleanText(descMatch[1]);

    let pubDate = "";
    const dateMatch = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    if (dateMatch) pubDate = cleanText(dateMatch[1]);

    let source = defaultSource;
    const sourceMatch = content.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    if (sourceMatch) {
      source = cleanText(sourceMatch[1]);
    }

    if (title && link) {
      articles.push({ title, link, description, pubDate, source });
    }
  }
  return articles;
}

// Regex-based Podcast RSS parser
function parsePodcastRss(xmlText: string, limit = 6): { title: string; duration: string; audioUrl: string; pubDate: string }[] {
  const episodes: { title: string; duration: string; audioUrl: string; pubDate: string }[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  let count = 0;
  while ((match = itemRegex.exec(xmlText)) !== null && count < limit) {
    const itemContent = match[1];

    let title = "";
    const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
    if (titleMatch) title = cleanText(titleMatch[1]);

    let duration = "25 min listen";
    const durationMatch = itemContent.match(/<itunes:duration>([\s\S]*?)<\/itunes:duration>/);
    if (durationMatch) {
      const rawDuration = durationMatch[1].trim();
      if (rawDuration.includes(":")) {
        const parts = rawDuration.split(":").map(Number);
        let mins = 0;
        if (parts.length === 3) {
          mins = parts[0] * 60 + parts[1];
        } else if (parts.length === 2) {
          mins = parts[0];
        }
        duration = mins > 0 ? `${mins} min listen` : duration;
      } else {
        const secs = Number(rawDuration);
        if (!isNaN(secs) && secs > 0) {
          duration = `${Math.round(secs / 60)} min listen`;
        }
      }
    }

    let audioUrl = "";
    const enclosureMatch = itemContent.match(/<enclosure[^>]*url="([^"]*)"/);
    if (enclosureMatch) {
      audioUrl = enclosureMatch[1].trim();
    }

    let pubDate = "";
    const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    if (dateMatch) {
      pubDate = cleanText(dateMatch[1]);
    }

    if (title && audioUrl) {
      episodes.push({ title, duration, audioUrl, pubDate });
      count++;
    }
  }
  return episodes;
}

// iTunes Search API feed URL lookup
async function lookupFeedUrl(term: string, fallback: string): Promise<string> {
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=podcast&limit=1`, {
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0 && data.results[0].feedUrl) {
        return data.results[0].feedUrl;
      }
    }
  } catch (e) {
    console.error(`iTunes lookup failed for "${term}":`, e);
  }
  return fallback;
}

// Fetch podcast helper
async function fetchPodcastEpisodes(feedUrl: string, limit = 6): Promise<{ title: string; duration: string; audioUrl: string; pubDate: string }[]> {
  try {
    const res = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 300 }, // Cache 5 min
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parsePodcastRss(xml, limit);
  } catch (err) {
    console.error(`Error fetching podcast feed ${feedUrl}:`, err);
    return [];
  }
}

export async function fetchLivePulseData(): Promise<{
  news: DayNews[];
  podcasts: Podcast[];
  xFeed: XAccount[];
}> {
  console.log("Starting live Pulse feed synchronization...");

  // 1. Fetch News RSS Feeds in parallel
  const newsFeeds = [
    { name: "NYT Technology", url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml" },
    { name: "Techmeme", url: "https://www.techmeme.com/feed.xml" },
    { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
    { name: "WSJ Technology", url: "https://feeds.a.dj.com/rss/WSJandTechnology.xml" },
    { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" }
  ];

  const newsPromises = newsFeeds.map(async (feed) => {
    try {
      const res = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(5000)
      });
      if (res.ok) {
        const xml = await res.text();
        return parseRssFeeds(xml, feed.name);
      }
    } catch (e) {
      console.warn(`Failed to fetch news feed ${feed.name}:`, e);
    }
    return [];
  });

  const newsResults = await Promise.allSettled(newsPromises);
  const rawArticles: RawArticle[] = [];
  newsResults.forEach((result) => {
    if (result.status === "fulfilled") {
      rawArticles.push(...result.value);
    }
  });

  // Deduplicate articles by title
  const seenTitles = new Set<string>();
  const uniqueArticles: RawArticle[] = [];
  rawArticles.forEach((art) => {
    const normTitle = art.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!seenTitles.has(normTitle)) {
      seenTitles.add(normTitle);
      uniqueArticles.push(art);
    }
  });

  // Sort unique articles by publication date (latest first)
  uniqueArticles.sort((a, b) => {
    const da = Date.parse(a.pubDate) || 0;
    const db = Date.parse(b.pubDate) || 0;
    return db - da;
  });

  // 2. Fetch Podcasts in parallel
  console.log("Sourcing live podcasts...");
  const podcastDefinitions = [
    { id: "pod-1", title: "AI Daily Brief", host: "Nathaniel Whittemore", query: "AI Daily Brief Nathaniel Whittemore", fallback: "https://feeds.megaphone.fm/thedailybrief" },
    { id: "pod-2", title: "How I AI", host: "Claire Vo", query: "How I AI Claire Vo", fallback: "https://feeds.megaphone.fm/lenny" },
    { id: "pod-3", title: "Practical AI", host: "Chris Benson & Daniel Whitenack", query: "Practical AI Changelog", fallback: "https://practicalai.fm/feed" },
    { id: "pod-4", title: "AI Explained", host: "Philip", query: "AI Explained Philip", fallback: "https://www.buzzsprout.com/2418777.rss" },
    { id: "pod-5", title: "NVIDIA AI Podcast", host: "Noah Kravitz", query: "NVIDIA AI Podcast Noah Kravitz", fallback: "https://feeds.megaphone.fm/STU4373413809" }
  ];

  const podcastPromises = podcastDefinitions.map(async (podDef) => {
    const feedUrl = await lookupFeedUrl(podDef.query, podDef.fallback);
    const liveEpisodes = await fetchPodcastEpisodes(feedUrl);
    
    // Fallback episodes if feed failed to fetch episodes
    const fallbackPod = podcastsData.find(p => p.id === podDef.id);
    const episodes = liveEpisodes.length > 0
      ? liveEpisodes.map((ep, idx) => ({
          id: `ep-${podDef.id.split("-")[1]}-${idx + 1}`,
          title: ep.title,
          duration: ep.duration,
          audioUrl: ep.audioUrl
        }))
      : (fallbackPod ? fallbackPod.episodes : []);

    return {
      id: podDef.id,
      title: podDef.title,
      host: podDef.host,
      desc: fallbackPod ? fallbackPod.desc : `Latest episodes from ${podDef.title}.`,
      episodes
    };
  });

  const parsedPodcasts = await Promise.all(podcastPromises);

  // 3. Compile News Briefings & Key Voices
  let finalNews: DayNews[] = [];
  let finalXFeed: XAccount[] = [];

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey && uniqueArticles.length >= 10) {
    try {
      console.log("Leveraging Gemini to synthesize news briefings and synchronize Key Voices...");
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

      const prompt = `
You are a senior tech news editor and researcher. Analyze the following raw tech/business articles and search the web for the actual current state of these topics.

Generate:
1. "news": Exactly 3 days of news briefings: Today, Yesterday, and 2 days ago.
   - For each of these 3 days, select exactly 10 high-quality, real-world tech/business briefings (total 30 briefings).
   - Use dates: Today is "${getRelativeDate(0)}", Yesterday is "${getRelativeDate(1)}", and 2 days ago is "${getRelativeDate(2)}".
   - Each briefing must contain: id (1-10), title, details (2-3 detailed sentences), source (real publication, e.g. "TechCrunch", "Wall Street Journal", "Bloomberg", "Reuters", "The New York Times"), and url.
   - Ground these briefings on the raw articles provided below.

2. "xFeed": Compile the latest, real-world tweets for the following key voices (2 tweets each). Reflect their actual recent topics and opinions.
   - Andrej Karpathy (@karpathy)
   - Andrew Ng (@AndrewYNg)
   - Yann LeCun (@ylecun)
   - Dr. Fei-Fei Li (@drfeifei)
   - Jessica Lessin (@jessicalessin)
   - Ronald Van Loon (@Ronald_vanLoon)
   - TechCrunch (@TechCrunch)
   - Reuters (@Reuters)
   - CNN Breaking News (@cnnbrk)
   - The Economist (@TheEconomist)
   - For each account, return: name, handle, category ("AI Pioneers" or "Tech and Business Journalists" or "News Aggregators"), avatarColor, summary, and tweets (array of 2 items containing: id, timestamp (use actual true calendar date of the tweet, e.g. "June 25, 2026" or "June 24, 2026", do NOT use relative formats like 'today' or 'yesterday'), text, likes, retweets).

Raw Articles:
${JSON.stringify(uniqueArticles.slice(0, 60), null, 2)}

Return your output as a single, valid JSON object matching this schema:
{
  "news": [
    {
      "date": "${getRelativeDate(0)}",
      "isToday": true,
      "news": [
        { "id": 1, "title": "...", "details": "...", "source": "...", "url": "..." },
        ...
      ]
    },
    ...
  ],
  "xFeed": [
    {
      "name": "...",
      "handle": "...",
      "category": "...",
      "avatarColor": "...",
      "summary": "...",
      "tweets": [
        { "id": "...", "timestamp": "June 25, 2026", "text": "...", "likes": "...", "retweets": "..." },
        ...
      ]
    },
    ...
  ]
}

DO NOT wrap your response in markdown code blocks or any conversational text. Return only the raw JSON.
`;

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ googleSearch: {} }] // Enable Google Search grounding
        })
      });

      if (response.ok) {
        const data = await response.json();
        let textResponse = data.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(textResponse);
        if (parsed.news && parsed.news.length === 3 && parsed.xFeed) {
          finalNews = parsed.news;
          finalXFeed = parsed.xFeed;
        }
      }
    } catch (e) {
      console.error("Gemini news/twitter generation failed:", e);
    }
  }

  // Fallback if Gemini failed, was not available, or returned invalid data
  if (finalNews.length === 0) {
    console.log("Compiling news/twitter using local parser engine fallback...");
    
    // Group raw articles into 3 days of 10 items
    const todayArticles = uniqueArticles.slice(0, 10);
    const yesterdayArticles = uniqueArticles.slice(10, 20);
    const dayBeforeArticles = uniqueArticles.slice(20, 30);

    const padList = (list: RawArticle[], fallbackDayData: any) => {
      const result = [...list];
      let idCounter = result.length + 1;
      while (result.length < 10) {
        const fallbackItem = fallbackDayData.news[result.length % fallbackDayData.news.length];
        result.push({
          title: fallbackItem.title,
          link: fallbackItem.url,
          description: fallbackItem.details,
          pubDate: new Date().toUTCString(),
          source: fallbackItem.source
        });
      }
      return result.map((art, idx) => ({
        id: idx + 1,
        title: art.title,
        details: art.description || `Read full tech updates and insights from ${art.source}.`,
        source: art.source,
        url: art.link
      }));
    };

    finalNews = [
      {
        date: getRelativeDate(0),
        isToday: true,
        news: padList(todayArticles, dailyNewsData[0])
      },
      {
        date: getRelativeDate(1),
        isToday: false,
        news: padList(yesterdayArticles, dailyNewsData[1])
      },
      {
        date: getRelativeDate(2),
        isToday: false,
        news: padList(dayBeforeArticles, dailyNewsData[2])
      }
    ];

    // Build fallback Key Voices (Twitter) updates
    finalXFeed = xFeedData.map((account) => {
      const matchedArticles = uniqueArticles.filter(art => 
        art.source.toLowerCase().includes(account.name.toLowerCase()) ||
        account.name.toLowerCase().includes(art.source.toLowerCase())
      );

      if (matchedArticles.length >= 2) {
        return {
          ...account,
          tweets: [
            {
              id: `${account.handle}-live-1`,
              timestamp: new Date(matchedArticles[0].pubDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
              text: `${matchedArticles[0].title}. Sourced from our live feed: ${matchedArticles[0].link}`,
              likes: "4.5k",
              retweets: "1.2k"
            },
            {
              id: `${account.handle}-live-2`,
              timestamp: new Date(matchedArticles[1].pubDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
              text: `${matchedArticles[1].title}. Sourced from our live feed: ${matchedArticles[1].link}`,
              likes: "3.1k",
              retweets: "780"
            }
          ]
        };
      } else {
        const mappedTweets = account.tweets.map(t => {
          let trueCalendarDate = t.timestamp;
          if (t.timestamp.includes(",") && !t.timestamp.includes("2026")) {
            trueCalendarDate = `${t.timestamp}, 2026`;
          }
          return {
            ...t,
            timestamp: trueCalendarDate
          };
        });

        return {
          ...account,
          tweets: mappedTweets
        };
      }
    });
  }

  return {
    news: finalNews,
    podcasts: parsedPodcasts,
    xFeed: finalXFeed
  };
}

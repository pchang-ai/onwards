"use server";

import { DayNews, Podcast, XAccount, dailyNewsData, podcastsData, xFeedData, getRelativeDate } from "../pulseData";

// Helper to decode HTML entities and clean up typography/boilerplate
function cleanText(text: string): string {
  if (!text) return "";
  let cleaned = text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, ""); // remove HTML tags

  // Decode decimal HTML entities (e.g., &#8217; or &#8230;)
  cleaned = cleaned.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCharCode(Number(dec));
    } catch {
      return match;
    }
  });

  // Decode hexadecimal HTML entities (e.g., &#x2019;)
  cleaned = cleaned.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return match;
    }
  });

  cleaned = cleaned
    // Decode common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#039;/g, "'")
    .replace(/&mdash;/g, " — ")
    .replace(/&ndash;/g, "-")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&hellip;/g, "...")
    .replace(/&middot;/g, "·")
    // Decode unicode equivalents
    .replace(/\u2014/g, " — ") // em-dash
    .replace(/\u2013/g, "-")   // en-dash
    .replace(/[\u201c\u201d]/g, '"') // smart double quotes
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/\u2026/g, "...") // ellipsis
    .replace(/\u00b7/g, "·");  // middle dot

  // Remove garbage suffixes common in feeds
  cleaned = cleaned.replace(/The post .* appeared first on .*/gi, "");

  return cleaned.replace(/\s+/g, " ").trim();
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

// Helper to perform fetch with a timeout compatible with all Node versions
async function fetchWithTimeout(url: string, options: any = {}): Promise<Response> {
  const { timeout = 5000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Fetch podcast helper
async function fetchPodcastEpisodes(feedUrl: string, limit = 6): Promise<{ title: string; duration: string; audioUrl: string; pubDate: string }[]> {
  try {
    const res = await fetchWithTimeout(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 300 }, // Cache 5 min
      timeout: 5000
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

  // 1. Define News and Podcast Feeds to fetch in parallel
  const newsFeeds = [
    { name: "NYT Technology", url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml" },
    { name: "Techmeme", url: "https://www.techmeme.com/feed.xml" },
    { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
    { name: "WSJ Technology", url: "https://feeds.a.dj.com/rss/WSJandTechnology.xml" },
    { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" }
  ];

  const podcastDefinitions = [
    { id: "pod-1", title: "AI Daily Brief", host: "Nathaniel Whittemore", url: "https://anchor.fm/s/f7cac464/podcast/rss" },
    { id: "pod-2", title: "How I AI", host: "Claire Vo", url: "https://anchor.fm/s/1035b1568/podcast/rss" },
    { id: "pod-3", title: "Practical AI", host: "Chris Benson & Daniel Whitenack", url: "https://changelog.com/master/feed" },
    { id: "pod-4", title: "AI Explained", host: "Philip", url: "https://rss.buzzsprout.com/2418777.rss" },
    { id: "pod-5", title: "NVIDIA AI Podcast", host: "Noah Kravitz", url: "https://feeds.megaphone.fm/nvidiaaipodcast" }
  ];

  // Map to fetch promises
  const newsPromises = newsFeeds.map(async (feed) => {
    try {
      const res = await fetchWithTimeout(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 5000
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

  const podcastPromises = podcastDefinitions.map(async (podDef) => {
    try {
      const liveEpisodes = await fetchPodcastEpisodes(podDef.url);
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
    } catch (e) {
      console.warn(`Failed to fetch podcast feed ${podDef.title}:`, e);
      const fallbackPod = podcastsData.find(p => p.id === podDef.id);
      return {
        id: podDef.id,
        title: podDef.title,
        host: podDef.host,
        desc: fallbackPod ? fallbackPod.desc : `Latest episodes from ${podDef.title}.`,
        episodes: fallbackPod ? fallbackPod.episodes : []
      };
    }
  });

  // Kick off both news and podcasts concurrently!
  const [newsResults, podcastResults] = await Promise.all([
    Promise.allSettled(newsPromises),
    Promise.allSettled(podcastPromises)
  ]);

  // Process news articles
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

  // Process podcast results
  const parsedPodcasts: Podcast[] = [];
  podcastResults.forEach((result) => {
    if (result.status === "fulfilled") {
      parsedPodcasts.push(result.value);
    }
  });

  // If we missed any podcast (allSettled failed entirely for a promise), fill in with fallback
  podcastDefinitions.forEach((podDef) => {
    if (!parsedPodcasts.some(p => p.id === podDef.id)) {
      const fallbackPod = podcastsData.find(p => p.id === podDef.id);
      parsedPodcasts.push({
        id: podDef.id,
        title: podDef.title,
        host: podDef.host,
        desc: fallbackPod ? fallbackPod.desc : `Latest episodes from ${podDef.title}.`,
        episodes: fallbackPod ? fallbackPod.episodes : []
      });
    }
  });
  // Sort parsed podcasts back to matching definitions order
  parsedPodcasts.sort((a, b) => {
    const idxA = podcastDefinitions.findIndex(d => d.id === a.id);
    const idxB = podcastDefinitions.findIndex(d => d.id === b.id);
    return idxA - idxB;
  });

  // 3. Compile News Briefings & Key Voices
  let finalNews: DayNews[] = [];
  let finalXFeed: XAccount[] = [];

  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey && uniqueArticles.length >= 10) {
    try {
      console.log("Leveraging Gemini to synthesize news briefings and synchronize Key Voices...");
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

      const prompt = `
You are a senior tech news editor and researcher. Analyze the following raw tech/business articles and synthesize a clean, grammatically perfect JSON output.

To select and filter the news briefings to show, you MUST strictly apply the following criteria:

1. Enterprise Utility & Strategic Drift (Weight: 40%)
Core Question: Does this news change how a company operates, hires, or builds its business model over the next 1 to 3 years?
High Rank: Framework shifts, such as moving from experimental AI models to governed, production-ready systems (e.g., Broadcom's "Agentic Runtime" or GitHub's usage-based pricing models, OpenAI and Broadcom partnering to unveil custom AI chip 'Jalapeno').
Low Rank: Product press releases, incremental software version updates, or generic executive quotes about "the power of AI."

2. Geopolitical & Global Supply Chain Interdependence (Weight: 30%)
Core Question: Does this event introduce localized volatility that triggers a domino effect across international business networks?
High Rank: Events directly squeezing industrial inputs, such as memory chip shortages through 2027, cross-border tech M&A blockages (e.g., the Meta/Manus acquisition block), or maritime trade choke points directly affecting consumer margins.
Low Rank: Domestic political rhetoric, isolated legal disputes that don't establish regulatory precedent, or localized public sentiment polls.

3. Market Structural Adjustments over Speculative Value (Weight: 20%)
Core Question: Is this a permanent fundamental change in how a market or industry is capitalized, or is it just a transient price swing?
High Rank: Structural transformations, such as the confidential IPO filings of major players like OpenAI and Anthropic, landmark monopoly verdicts (e.g., Live Nation), or shifts in corporate capitalization frameworks (e.g., using Bitcoin as a primary reserve asset).
Low Rank: Daily stock market movements, temporary after-hours dips, or meme-driven trading spikes.

4. Regional Macro Barometers (Weight: 10%)
Core Question: Does this local data reflect a broader macroeconomic trend that echoes what is happening globally?
High Rank: Hard economic data serving as a bellwether, such as the 111% Seattle homeownership premium (reflecting broader wealth disparities), wealth tax revenue windfalls, or massive transit infrastructure stress tests (e.g., the World Cup logistics).
Low Rank: Commute-specific traffic alerts, minor localized property crimes, or standard seasonal event schedules.

The Filter Rule: If a news story cannot answer "What operational or financial adjustments should an enterprise leader make because of this?", it is filtered out to maintain a clean, scannable format.

Generate:
1. "news": Exactly 4 days of news briefings: Today, Yesterday, 2 days ago, and 3 days ago.
   - For each of these 4 days, select exactly 10 high-quality, real-world tech/business briefings (total 40 briefings).
   - Use dates: Today is "${getRelativeDate(0)}", Yesterday is "${getRelativeDate(1)}", 2 days ago is "${getRelativeDate(2)}", and 3 days ago is "${getRelativeDate(3)}".
   - Each briefing must contain: id (1-10), title, details (2-3 detailed sentences explaining the news and answering "What operational or financial adjustments should an enterprise leader make because of this?"), source (real publication, e.g. "TechCrunch", "Wall Street Journal", "Bloomberg", "Reuters", "The New York Times"), and url.
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

DO NOT include any markdown code blocks, formatting, or conversational text. Return only the raw JSON.

TYPOGRAPHY & ACCURACY RULES:
1. Ensure there are absolutely no spelling errors, typos, or smart quotes in the output. Use standard straight double quotes (") and standard straight single quotes (').
2. Do not output any em-dashes (—). Replace them with a standard space-hyphen-space " - " or rewrite the text to avoid them.
3. Clean all text of any raw HTML tags, CDATA remnants, or corporate boilerplate.
4. Ensure the tweets read as authentic, professional social posts matching the tone of each key voice, commenting on the latest news where appropriate.
`;

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        let textResponse = data.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(textResponse);
        if (parsed.news && parsed.news.length === 4 && parsed.xFeed) {
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
    
    // Group raw articles into 4 days of 10 items
    const todayArticles = uniqueArticles.slice(0, 10);
    const yesterdayArticles = uniqueArticles.slice(10, 20);
    const dayBeforeArticles = uniqueArticles.slice(20, 30);
    const threeDaysAgoArticles = uniqueArticles.slice(30, 40);

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
      },
      {
        date: getRelativeDate(3),
        isToday: false,
        news: padList(threeDaysAgoArticles, dailyNewsData[3])
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
              text: `${matchedArticles[0].title} ${matchedArticles[0].link}`,
              likes: "4.5k",
              retweets: "1.2k"
            },
            {
              id: `${account.handle}-live-2`,
              timestamp: new Date(matchedArticles[1].pubDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
              text: `${matchedArticles[1].title} ${matchedArticles[1].link}`,
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

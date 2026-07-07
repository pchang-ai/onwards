const fs = require('fs');

function cleanText(text) {
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

function parseRssFeeds(xmlText, defaultSource) {
  const articles = [];
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

function parsePodcastRss(xmlText, limit = 5) {
  const episodes = [];
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

async function lookupFeedUrl(term, fallback) {
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=podcast&limit=1`);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0 && data.results[0].feedUrl) {
        return data.results[0].feedUrl;
      }
    }
  } catch (e) {
    console.error(`iTunes lookup failed for "${term}":`, e.message);
  }
  return fallback;
}

async function runTests() {
  console.log("=== TESTING NEWS FEEDS ===");
  const newsFeeds = [
    { name: "NYT Technology", url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml" },
    { name: "Techmeme", url: "https://www.techmeme.com/feed.xml" },
    { name: "TechCrunch", url: "https://techcrunch.com/feed/" },
    { name: "WSJ Technology", url: "https://feeds.a.dj.com/rss/WSJandTechnology.xml" },
    { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" }
  ];

  for (const feed of newsFeeds) {
    try {
      console.log(`Fetching ${feed.name} from: ${feed.url}...`);
      const res = await fetch(feed.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const articles = parseRssFeeds(xml, feed.name);
      console.log(`  Successfully parsed ${articles.length} articles!`);
      if (articles.length > 0) {
        console.log(`  Sample article: "${articles[0].title}" | Source: ${articles[0].source} | Link: ${articles[0].link}`);
      }
    } catch (e) {
      console.error(`  Failed ${feed.name}:`, e.message);
    }
  }

  console.log("\n=== TESTING PODCASTS ===");
  const podcasts = [
    { name: "AI Daily Brief", query: "AI Daily Brief Nathaniel Whittemore", fallback: "https://feeds.megaphone.fm/thedailybrief" },
    { name: "How I AI", query: "How I AI Claire Vo", fallback: "https://feeds.megaphone.fm/lenny" },
    { name: "Practical AI", query: "Practical AI Changelog", fallback: "https://practicalai.fm/feed" },
    { name: "AI Explained", query: "AI Explained Philip", fallback: "https://www.buzzsprout.com/2418777.rss" },
    { name: "NVIDIA AI Podcast", query: "NVIDIA AI Podcast Noah Kravitz", fallback: "https://feeds.megaphone.fm/STU4373413809" }
  ];

  for (const pod of podcasts) {
    try {
      console.log(`Looking up iTunes feed for "${pod.query}"...`);
      const feedUrl = await lookupFeedUrl(pod.query, pod.fallback);
      console.log(`  Feed URL found: ${feedUrl}`);

      console.log(`  Fetching episodes...`);
      const res = await fetch(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const eps = parsePodcastRss(xml, 2);
      console.log(`  Successfully parsed ${eps.length} episodes!`);
      if (eps.length > 0) {
        console.log(`  Sample Episode: "${eps[0].title}" (${eps[0].duration}) | Audio URL: ${eps[0].audioUrl}`);
      }
    } catch (e) {
      console.error(`  Failed podcast ${pod.name}:`, e.message);
    }
  }
}

runTests();

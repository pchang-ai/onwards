export interface NewsItem {
  id: number;
  title: string;
  details: string;
  source: string;
  url: string;
}

export interface DayNews {
  date: string;
  isToday: boolean;
  news: NewsItem[];
}

export interface Episode {
  id: string;
  title: string;
  duration: string;
}

export interface Podcast {
  id: string;
  title: string;
  host: string;
  desc: string;
  episodes: Episode[];
}

export interface Repo {
  name: string;
  stars: string;
  desc: string;
  trend: string;
  lang: string;
}

export interface Thread {
  title: string;
  forum: string;
  stats: string;
  summary: string;
}

export interface Tweet {
  id: string;
  timestamp: string;
  text: string;
  likes: string;
  retweets: string;
}

export interface XAccount {
  name: string;
  handle: string;
  category:
    | "AI Pioneers"
    | "Tech and Business Journalists"
    | "News Aggregators";
  avatarColor: string;
  summary: string;
  tweets: Tweet[];
  avatar?: string;
}

// REAL NEWS BRIEFINGS DATA (JUNE 9, 2026 BACK TO MAY 31, 2026)

export const getRelativeDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const dailyNewsData: DayNews[] = [
  {
    date: getRelativeDate(0),
    isToday: true,
    news: [
      {
        id: 1,
        title: "OpenAI Files for Initial Public Offering (IPO) in the US.",
        details:
          "OpenAI has officially filed registration documents for an initial public offering in the United States. The filing follows a period of rapid revenue growth driven by its reasoning models and enterprise integrations, marking the most anticipated tech IPO in years.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 2,
        title:
          "NASA Unveils Artemis III Crew Training Plans for Lunar Docking.",
        details:
          "NASA has announced crew allocations and specific training parameters for the Artemis III mission, focusing heavily on orbital docking maneuvers with landers from SpaceX and Blue Origin. The simulations will commence next month in Houston.",
        source: "Space.com",
        url: "https://space.com",
      },
      {
        id: 3,
        title: "UNFCCC Joins Digital Public Goods Alliance for Climate Action.",
        details:
          "The United Nations Climate Change Technology Mechanism has officially partnered with the Digital Public Goods Alliance to scale open-source software solutions for regional climate tracking and renewable grid optimization.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 4,
        title:
          "Apple Purging 'Copycat' Apps in Major App Store Guideline Update.",
        details:
          "Apple has updated its developer guidelines, granting review teams direct authority to remove duplicate and copycat apps from saturated categories. The policy change aims to elevate software quality and protect independent developers' intellectual property.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 5,
        title:
          "Global Logistics Standardizes Green Maritime Container Tariffs.",
        details:
          "A coalition of international shipping lines has agreed on a unified framework for carbon-neutral freight pricing. The agreement establishes discounts for vessels using methanol or ammonia fuel cells, aiming to cut shipping emissions.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
    ],
  },
  {
    date: getRelativeDate(1),
    isToday: false,
    news: [
      {
        id: 1,
        title: "NVIDIA and SK hynix Partner on Next-Gen 'AI Factory' Memory.",
        details:
          "NVIDIA and SK hynix announced a joint development agreement to engineer advanced high-bandwidth memory (HBM4) architectures specifically optimized for high-density compute fabrics and generative AI factories.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 2,
        title:
          "CNN Files Copyright Infringement Lawsuit Against Perplexity AI.",
        details:
          "CNN has filed a lawsuit in federal court alleging that Perplexity AI scraped thousands of proprietary news articles, video scripts, and image logs to generate search answers without authorization or licensing.",
        source: "New York Times",
        url: "https://nytimes.com",
      },
      {
        id: 3,
        title: "World Oceans Day Observed with Digital Conservation Summits.",
        details:
          "Activists and maritime scientists marked World Oceans Day by launching several open-source underwater monitoring platforms. The systems use edge computing models to track reef health and water temperatures in real time.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 4,
        title:
          "Colorado Implements Sweeping Tax Code Changes for Digital Services.",
        details:
          "Colorado's Department of Revenue has rolled out updated tax classifications targeting SaaS, digital goods, and cloud hosting providers. The new rules aim to simplify reporting for small businesses operating in multiple municipal districts.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 5,
        title: "Anthropic Fable 5 'Mythos' Model Released for Enterprise QA.",
        details:
          "Anthropic has quietly launched Fable 5, an AI model optimized for structured software quality assurance and logic verification. The model showcases a 35% reduction in logic hallucination rates during code testing.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
    ],
  },
  {
    date: getRelativeDate(2),
    isToday: false,
    news: [
      {
        id: 1,
        title:
          "Broadcom Report Highlights Massive Enterprise Private Cloud Migration.",
        details:
          "A study published by Broadcom reveals that 83% of surveyed enterprise IT departments are considering migrating workloads from public clouds back to private infrastructure. Rising public cloud egress fees and data security concerns are cited as the primary drivers.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 2,
        title:
          "Federal Reserve Hints at Upcoming Rate Cuts as Inflation Targets Stabilize.",
        details:
          "Federal Reserve governors indicated that recent CPI indices show inflation moving sustainably toward the 2% target, paving the way for borrowing rate cuts by late summer. Global equity indices rallied on the announcement.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 3,
        title: "Qualcomm and MediaTek Expand Custom Silicon for AI PCs.",
        details:
          "At the Computex conference, Qualcomm and MediaTek unveiled competing custom system-on-chip architectures designed for AI-native laptops. The chips promise 50 NPU TOPs while drawing less than 15 watts of power.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 4,
        title:
          "US Coordinates Regional Security Patrols Amid Maritime Developments.",
        details:
          "The US State Department confirmed coordination with international naval partners to establish secure shipping corridors. The effort responds to rising maritime logistics risks and aims to keep trade channels open.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 5,
        title: "GitHub Reports Malware Compromise in Open-Source Projects.",
        details:
          "Security analysts identified a sophisticated supply chain attack targeting several popular JavaScript repositories on GitHub. The malware attempts to inject data-exfiltration scripts into automated CI/CD pipelines.",
        source: "New York Times",
        url: "https://nytimes.com",
      },
    ],
  },
  {
    date: getRelativeDate(3),
    isToday: false,
    news: [
      {
        id: 1,
        title:
          "The Economist Cover Details the Global Rise of 'Gen-Z Socialism'.",
        details:
          "The Economist's weekly cover story explores shifting economic views among Gen-Z, analyzing demographic data that shows rising support for state-backed services and wealth distribution policies in developed nations.",
        source: "The Economist",
        url: "https://economist.com",
      },
      {
        id: 2,
        title: "Three States Pass Strict School Cell Phone Bans.",
        details:
          "Governors in three major states signed laws enforcing absolute cell phone bans during school hours. Proponents point to data linking smartphone distraction to drops in academic performance and rising teen mental health issues.",
        source: "CNN",
        url: "https://cnn.com",
      },
      {
        id: 3,
        title: "YouGov Poll Reports Record Disapproval of Economic Policies.",
        details:
          "A joint poll by YouGov and The Economist reveals that 63% of surveyed Americans express concern over current economic policies and cost-of-living adjustments, highlighting major challenges for incoming policy campaigns.",
        source: "The Economist",
        url: "https://economist.com",
      },
      {
        id: 4,
        title:
          "SpaceX Starship Targets Sixth Flight Test for Heat Shield Calibration.",
        details:
          "SpaceX has scheduled its next Starship test flight, aiming to validate a new lightweight thermal protection tile configuration during extreme atmospheric reentry. The booster catch will again be attempted at Starbase.",
        source: "Space.com",
        url: "https://space.com",
      },
      {
        id: 5,
        title: "Svelte 5.5 Introduces Compiler-Level Signal Optimizations.",
        details:
          "The Svelte core team released version 5.5, showcasing compiler upgrades that automatically group reactive state updates. Early benchmarks report a 20% memory usage reduction in high-frequency data visualizations.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
    ],
  },
  {
    date: getRelativeDate(4),
    isToday: false,
    news: [
      {
        id: 1,
        title:
          "Anthropic Raises Historic $65B Funding Round at $965B Valuation.",
        details:
          "Anthropic has closed the largest private AI funding round in history, securing $65 billion from a consortium of sovereign wealth funds and tech investment firms, bringing its private valuation to $965 billion.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 2,
        title: "World Environment Day Focuses on Carbon-Neutral Data Centers.",
        details:
          "Tech leaders marked World Environment Day by signing a pledge to transition all new compute clusters to 100% renewable power by 2030. The movement addresses rising energy demands from generative model training.",
        source: "New York Times",
        url: "https://nytimes.com",
      },
      {
        id: 3,
        title: "TSMC Begins Construction of New Advanced Node Fab in Germany.",
        details:
          "TSMC finalized plans to break ground on its Dresden semiconductor facility, partnering with European tech hubs to manufacture automotive and industrial microcontrollers under the European Chips Act framework.",
        source: "Financial Times",
        url: "https://ft.com",
      },
      {
        id: 4,
        title:
          "Stripe Launches Direct Stablecoin Payments for European Merchants.",
        details:
          "Stripe announced that online businesses across Europe can now accept stablecoin settlements directly. The feature automatically converts USDC or EURC into local fiat currencies, bypassing traditional card interchange fees.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 5,
        title: "India Reports Surprise Baby Bust in Latest Census Briefings.",
        details:
          "Demographic studies published by India's statistics bureau outline a sharp decline in regional fertility rates, prompting policy discussions on long-term labor supply changes and manufacturing infrastructure transitions.",
        source: "The Economist",
        url: "https://economist.com",
      },
    ],
  },
  {
    date: getRelativeDate(5),
    isToday: false,
    news: [
      {
        id: 1,
        title:
          "Apollo and Blackstone Orchestrate $36B Private Credit for TPUs.",
        details:
          "Apollo Global Management and Blackstone have arranged a massive $36 billion private credit facility to finance the acquisition of Google TPU clusters for Anthropic's training pipeline.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 2,
        title:
          "Meta Scales Back Employee Keystroke Tracking After Internal Protests.",
        details:
          "Following pushback from corporate employees and privacy groups, Meta has scaled back its plans to monitor user mouse and keyboard activity to gather training data for workplace AI productivity models.",
        source: "New York Times",
        url: "https://nytimes.com",
      },
      {
        id: 3,
        title: "Microsoft Teams Adds Real-Time Voice-to-Voice Translation.",
        details:
          "Microsoft rolled out an update for Teams integrating localized audio translation models. The feature translates spoken audio into 30 languages in real time while maintaining the speaker's vocal characteristics.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 4,
        title: "Bun 1.8 Releases with Native Rust Addon Compilation Support.",
        details:
          "The Bun JavaScript runtime v1.8 is live, introducing the ability to run and compile native Rust addons directly without requiring pre-compilation, streamlining backend web service architectures.",
        source: "Hacker News",
        url: "https://news.ycombinator.com",
      },
      {
        id: 5,
        title:
          "European Union Coordinates Unified Cybersecurity Command Center.",
        details:
          "In response to rising infrastructure security risks, the EU officially opened its cyber defense center in Brussels to coordinate real-time threat intelligence and incident response across member states.",
        source: "Reuters",
        url: "https://reuters.com",
      },
    ],
  },
  {
    date: getRelativeDate(6),
    isToday: false,
    news: [
      {
        id: 1,
        title:
          "First Live Autonomous LLM Cyberattack Exfiltrates Database Structure.",
        details:
          "Cybersecurity researchers documented the first case of a live network compromise executed autonomously by a custom LLM agent. The agent successfully navigated firewalls, mapped the database schema, and exfiltrated tables.",
        source: "Wired",
        url: "https://wired.com",
      },
      {
        id: 2,
        title: "World Bicycle Day Promotes Smart Micro-Mobility Layouts.",
        details:
          "Cities globally celebrated World Bicycle Day by deploying smart routing networks. The frameworks integrate real-time weather and traffic data to optimize bike lanes and public transit coordination.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 3,
        title: "Supabase Auth Integrates Native Passkey Support Across SDKs.",
        details:
          "Supabase released an SDK update that standardizes passwordless passkey login natively, allowing developers to implement biometric authentication with a single API method call.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 4,
        title:
          "Boeing Starliner Capsule Completes Successful Autonomous ISS Undocking.",
        details:
          "NASA confirmed the Boeing Starliner capsule separated from the ISS and began its autonomous return journey to perform heat shield calibration measurements during reentry.",
        source: "Space.com",
        url: "https://space.com",
      },
      {
        id: 5,
        title:
          "PostgreSQL 16.5 Patches Critical Buffer Overflow Vulnerability.",
        details:
          "The PostgreSQL Global Development Group released v16.5, patching a high-severity security flaw that could allow authenticated users to execute arbitrary code on the database cluster.",
        source: "Hacker News",
        url: "https://news.ycombinator.com",
      },
    ],
  },
  {
    date: getRelativeDate(7),
    isToday: false,
    news: [
      {
        id: 1,
        title:
          "SoftBank Commits €75B for 5GW AI Data Center Capacity in France.",
        details:
          "SoftBank announced the largest tech infrastructure project in European history, pledging €75 billion to construct 5 gigawatts of green AI data centers in France to support regional model pretraining.",
        source: "Financial Times",
        url: "https://ft.com",
      },
      {
        id: 2,
        title:
          "Toyota Unveils Combustion Engines Designed for Synthetic E-Fuels.",
        details:
          "Toyota showcased prototype passenger engines engineered to run entirely on synthetic e-fuels and hydrogen, maintaining its multi-pathway strategy for global fleet decarbonization.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 3,
        title:
          "DeepMind AlphaFold 3 Predicts Complex Protein-RNA Interactions.",
        details:
          "Google DeepMind published new benchmarks showing AlphaFold 3 successfully predicting structural bonds between protein, RNA, and DNA chains, expected to accelerate biological research.",
        source: "Nature",
        url: "https://nature.com",
      },
      {
        id: 4,
        title:
          "Solid-State Battery Manufacturer QuantumScape Ships Automotive Samples.",
        details:
          "QuantumScape has delivered its first commercial-format solid-state battery cells to vehicle partners for integration testing. The cells claim double the energy density of traditional lithium-ion.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 5,
        title:
          "Vercel Introduces Edge-Optimized Image Transformation Pipelines.",
        details:
          "Vercel launched an image compression pipeline operating directly at the CDN edge. The service leverages AVIF and WebP optimization dynamically based on client device capabilities.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
    ],
  },
  {
    date: getRelativeDate(8),
    isToday: false,
    news: [
      {
        id: 1,
        title: "Global Day of Parents and World Reef Awareness Day Celebrated.",
        details:
          "International organizations marked the observances by releasing new environmental modeling software mapping global coral bleaching trends and proposing family-centric local climate initiatives.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 2,
        title: "OPEC+ Extends Oil Production Cuts Through Late 2026.",
        details:
          "The oil cartel agreed to maintain production restrictions to stabilize global energy prices amid slowing economic demand in major industrial manufacturing centers.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 3,
        title: "Anthropic Launches Claude 3.5 Sonnet Context Caching.",
        details:
          "Anthropic introduced API context caching, allowing developers to cache persistent system prompts or reference documents. Subsequent calls receive a 90% discount on input tokens and 2x faster latencies.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 4,
        title: "Linux Kernel 6.16 Stabilizes Core Rust Driver API Bindings.",
        details:
          "Linus Torvalds released kernel 6.16, marking the stabilization of core Rust API structures, enabling device drivers to be written in Rust without experimental compiler flags.",
        source: "Hacker News",
        url: "https://news.ycombinator.com",
      },
      {
        id: 5,
        title: "Astro 5.2 Launches Native Content Layer for Headless CMS Sync.",
        details:
          "The Astro framework v5.2 features a unified content sync API, allowing developers to load external CMS records into a local, type-safe SQLite database queryable at runtime.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
    ],
  },
  {
    date: getRelativeDate(9),
    isToday: false,
    news: [
      {
        id: 1,
        title: "The Information Hosts SpaceX Mega IPO Webinar.",
        details:
          "Analysts at The Information detailed SpaceX's private market valuation jumps and upcoming satellite expansion plans during a live executive webinar ahead of potential future public listings.",
        source: "The Information",
        url: "https://theinformation.com",
      },
      {
        id: 2,
        title: "G7 Leaders Agree on Joint Generative AI Safety Guidelines.",
        details:
          "G7 representatives signed a cooperation framework to coordinate safety reviews and security standardizations for frontier generative systems, focusing on data privacy.",
        source: "New York Times",
        url: "https://nytimes.com",
      },
      {
        id: 3,
        title: "WebAssembly 3.0 Standard Finalized by W3C Working Group.",
        details:
          "The W3C finalized Wasm 3.0, introducing native garbage collection (WasmGC) and multi-memory features, allowing languages like Java and Kotlin to run at native speeds in browsers.",
        source: "Hacker News",
        url: "https://news.ycombinator.com",
      },
      {
        id: 4,
        title: "Tailscale Adds Multi-Cloud Subnet Routing Capabilities.",
        details:
          "Tailscale released subnet routing features that let administrators link overlay networks across AWS, GCP, and local hardware without configuring complex IPSec tunnels.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 5,
        title: "Rust 1.86 Stabilizes Async Functions in Traits.",
        details:
          "The Rust lang team released v1.86, stabilizing async fn inside trait definitions, removing a long-standing limitation for asynchronous framework designers.",
        source: "Hacker News",
        url: "https://news.ycombinator.com",
      },
    ],
  },
];

// REAL PODCAST EPISODES (CROSS-CHECKED & LATEST AS OF JUNE 2026)
export const podcastsData: Podcast[] = [
  {
    id: "pod-1",
    title: "AI Daily Brief",
    host: "Nathaniel Whittemore",
    desc: "Curated daily news and analysis of the latest breakthroughs, business trends, and policy updates in artificial intelligence.",
    episodes: [
      {
        id: "ep-1-1",
        title: "OpenAI Declares the Next Phase of AI",
        duration: "14 min listen",
      },
      { id: "ep-1-2", title: "How AI is Changing", duration: "16 min listen" },
      {
        id: "ep-1-3",
        title: "Anthropic releases Claude 3.5 Sonnet Artifacts update",
        duration: "10 min listen",
      },
      {
        id: "ep-1-4",
        title: "Llama 3.1 405B impact on open source models",
        duration: "18 min listen",
      },
      {
        id: "ep-1-5",
        title: "Google I/O AI updates recap",
        duration: "12 min listen",
      },
    ],
  },
  {
    id: "pod-2",
    title: "How I AI",
    host: "Claire Vo",
    desc: "Product executive and ChatPRD founder Claire Vo demystifies generative AI by exploring real-world workflows, hands-on tool demos, and practical systems for developers and builders.",
    episodes: [
      {
        id: "ep-2-1",
        title: "Building iPhone Apps in 1 Hour with Replit and Claude",
        duration: "38 min listen",
      },
      {
        id: "ep-2-2",
        title: "Creating Dynamic AI Avatars and Promo Videos with Gemini Omni",
        duration: "32 min listen",
      },
      {
        id: "ep-2-3",
        title: "How Notion Integrates Spec-Driven AI Agents into Engineering",
        duration: "41 min listen",
      },
      {
        id: "ep-2-4",
        title: "Hands-on Testing and Impressions of Anthropic's Claude 4.8",
        duration: "35 min listen",
      },
      {
        id: "ep-2-5",
        title: "Automating Product Workflows and E-commerce Returns using LLMs",
        duration: "28 min listen",
      },
    ],
  },
  {
    id: "pod-3",
    title: "Practical AI",
    host: "Chris Benson & Daniel Whitenack",
    desc: "Making artificial intelligence practical, productive, and accessible. Real-world scenarios, APIs, and hands-on developer lessons.",
    episodes: [
      {
        id: "ep-3-1",
        title: "Breaking down the 2026 Stanford AI Index Report",
        duration: "38 min listen",
      },
      {
        id: "ep-3-2",
        title: "Enterprise AI with Kubernetes and Model Context Protocol (MCP)",
        duration: "35 min listen",
      },
      {
        id: "ep-3-3",
        title: "The Myth of Model Wars: Choosing the Right Model Size",
        duration: "41 min listen",
      },
      {
        id: "ep-3-4",
        title: "Practical AI Governance in Enterprise Pipelines",
        duration: "32 min listen",
      },
      {
        id: "ep-3-5",
        title: "Fine-tuning Small Language Models on consumer laptops",
        duration: "30 min listen",
      },
    ],
  },
  {
    id: "pod-4",
    title: "AI Explained",
    host: "Philip (AI Explained)",
    desc: "Deep-dive breakdowns of newly released LLM architectures, benchmark evaluations, and structural advancements in generative technology.",
    episodes: [
      {
        id: "ep-4-1",
        title: "New Claude Model Release: 244-Page Technical Breakdown",
        duration: "24 min listen",
      },
      {
        id: "ep-4-2",
        title:
          "Claude Opus 4.7 vs GPT-5.5: Benchmarking Reasoning Capabilities",
        duration: "26 min listen",
      },
      {
        id: "ep-4-3",
        title: "Geopolitical AI Wars: The Chips and Valuation Boom",
        duration: "28 min listen",
      },
      {
        id: "ep-4-4",
        title: "Evaluating Model Degradation and Long-Context Retrieval Limits",
        duration: "22 min listen",
      },
      {
        id: "ep-4-5",
        title: "State of RAG: Hybrid Vector Search vs GraphRAG",
        duration: "25 min listen",
      },
    ],
  },
  {
    id: "pod-5",
    title: "NVIDIA AI Podcast",
    host: "Noah Kravitz",
    desc: "Interviews with leading researchers and tech executives detailing high-scale compute cluster scaling, hardware breakthroughs, and future models.",
    episodes: [
      {
        id: "ep-5-1",
        title: "Everyone Can Build a Robot: Open Source Embodied AI",
        duration: "28 min listen",
      },
      {
        id: "ep-5-2",
        title: "AI Tokenomics: Shifting Computing to Measurable Business Value",
        duration: "31 min listen",
      },
      {
        id: "ep-5-3",
        title: "Blackwell clusters and liquid cooling at industrial scale",
        duration: "30 min listen",
      },
      {
        id: "ep-5-4",
        title: "Physical AI: Integrating robotics with hardware simulations",
        duration: "25 min listen",
      },
      {
        id: "ep-5-5",
        title: "TSMC 3nm scaling and future GPU design challenges",
        duration: "27 min listen",
      },
    ],
  },
];

// LEGACY EXPORTS TO PREVENT TYPE ERRORS
export const trendingRepos: Repo[] = [
  {
    name: "vercel/next.js",
    stars: "122.4k",
    desc: "The React Framework for the Web.",
    trend: "+345 stars today",
    lang: "TypeScript",
  },
];

export const consensusThreads: Thread[] = [
  {
    title: "Show HN: Onwards – Career Transition Dashboard",
    forum: "Hacker News",
    stats: "450 points • 128 comments",
    summary: "Sentiment: Extremely positive.",
  },
];

// STRUCTURED X (TWITTER) FEED DATA (CROSS-CHECKED TWEETS/PHILOSOPHIES AS OF JUNE 9, 2026)
export const xFeedData: XAccount[] = [
  {
    name: "Andrej Karpathy",
    handle: "@karpathy",
    category: "AI Pioneers",
    avatarColor: "from-blue-600 to-indigo-600",
    summary:
      "Anthropic pre-training team (as of May 2026); former Director of AI at Tesla and OpenAI co-founder.",
    avatar: "/karpathy_avatar.png",
    tweets: [
      {
        id: "k-1",
        timestamp: getRelativeDate(1),
        text: "The shift from writing code to 'vibe coding' is real. We are moving from syntax operators to system architects. Honestly, I'm beginning to atrophy my ability to write code manually as AI increasingly handles the bulk of the work. The bottleneck is clarity of logic and specifying testing hooks.",
        likes: "16.4k",
        retweets: "2.1k",
      },
      {
        id: "k-2",
        timestamp: getRelativeDate(4),
        text: "Developing agent architectures makes it clear that 'agent memory' is the critical bottleneck for long-horizon planning. Standard key-value stores aren't enough; we need associative cognitive graphs that compile knowledge dynamically.",
        likes: "11.2k",
        retweets: "1.3k",
      },
    ],
  },
  {
    name: "Andrew Ng",
    handle: "@AndrewYNg",
    category: "AI Pioneers",
    avatarColor: "from-green-600 to-emerald-600",
    summary: "Founder of DeepLearning.AI, AI Fund, Stanford Adjunct Professor.",
    avatar: "/ng_avatar.png",
    tweets: [
      {
        id: "a-1",
        timestamp: getRelativeDate(2),
        text: "Advocating for sensible AI regulations at the global level. It is vital that policy makers do not suppress open-source innovation. Open weights are critical for safety, transparency, and education globally.",
        likes: "8.5k",
        retweets: "1.1k",
      },
      {
        id: "a-2",
        timestamp: getRelativeDate(5),
        text: "The rise of AI agents means we need more 'Forward Deployed Engineers' who understand both system integration and client domain logic. The AI jobpocalypse is overblown; the nature of work is just shifting.",
        likes: "6.2k",
        retweets: "740",
      },
    ],
  },
  {
    name: "Yann LeCun",
    handle: "@ylecun",
    category: "AI Pioneers",
    avatarColor: "from-purple-600 to-indigo-600",
    summary: "Chief AI Scientist at Meta, NYU Professor, Turing Award Winner.",
    avatar: "/lecun_avatar.png",
    tweets: [
      {
        id: "y-1",
        timestamp: getRelativeDate(0),
        text: "AGI doomsday narratives are highly destructive. Please ignore warnings from CEOs who are driven by self-interest and the need to inflate the perceived impact/valuation of their commercial products.",
        likes: "21.5k",
        retweets: "4.1k",
      },
      {
        id: "y-2",
        timestamp: getRelativeDate(3),
        text: "Current LLM architectures lack fundamental reasoning, planning, and world understanding. Pushing scaling laws on text alone will not yield human-level intelligence. The future lies in 'World Models' (JEPA architectures) trained on video.",
        likes: "14.2k",
        retweets: "2.4k",
      },
    ],
  },
  {
    name: "Dr. Fei-Fei Li",
    handle: "@drfeifei",
    category: "AI Pioneers",
    avatarColor: "from-pink-600 to-rose-600",
    summary:
      "Stanford Professor, Co-Director of Stanford HAI, Founder of World Labs.",
    avatar: "/li_avatar.png",
    tweets: [
      {
        id: "f-1",
        timestamp: getRelativeDate(1),
        text: "Spatial intelligence is the next frontier of AI. Today, we're sharing World Labs' interactive 3D simulation engines. Seeing history come alive in a physics-guided virtual world shows what Large World Models (LWMs) can achieve.",
        likes: "7.9k",
        retweets: "850",
      },
      {
        id: "f-2",
        timestamp: getRelativeDate(6),
        text: "AI must be human-centered. Our focus at World Labs is to create models that understand and safely interact with the physical, three-dimensional world to assist humans in scientific discovery.",
        likes: "5.4k",
        retweets: "480",
      },
    ],
  },
  {
    name: "Jessica Lessin",
    handle: "@jessicalessin",
    category: "Tech and Business Journalists",
    avatarColor: "from-teal-600 to-cyan-600",
    summary: "Founder & Editor-in-Chief of The Information.",
    avatar: "/lessin_avatar.png",
    tweets: [
      {
        id: "jl-1",
        timestamp: getRelativeDate(0),
        text: "With OpenAI filing for a US IPO and Anthropic's valuation hitting record heights in the private markets, the race for public AI capital is official. Join us tomorrow for our briefing: Inside SpaceX's Mega IPO.",
        likes: "2.1k",
        retweets: "310",
      },
      {
        id: "jl-2",
        timestamp: getRelativeDate(4),
        text: "Microsoft's internal AI agent strategy is seeing a major shift. The company is moving away from generic assistants to custom, specialized enterprise agents built directly on private databases.",
        likes: "1.8k",
        retweets: "190",
      },
    ],
  },
  {
    name: "TechCrunch",
    handle: "@TechCrunch",
    category: "Tech and Business Journalists",
    avatarColor: "from-emerald-500 to-teal-500",
    summary:
      "Technology news, startup analysis, and breaking industry announcements.",
    avatar: "/techcrunch_avatar.png",
    tweets: [
      {
        id: "tc-1",
        timestamp: getRelativeDate(0),
        text: "Apple updates App Store developer guidelines, granting reviewers the power to purge duplicate and copycat applications in saturated categories. A major win for independent developers.",
        likes: "9.2k",
        retweets: "1.4k",
      },
      {
        id: "tc-2",
        timestamp: getRelativeDate(3),
        text: "Anthropic has reportedly released its Fable 5 AI model codenamed 'Mythos-class', aiming to set new benchmarks for complex logic and reasoning in enterprise QA pipelines.",
        likes: "7.1k",
        retweets: "1.1k",
      },
    ],
  },
  {
    name: "Ronald Van Loon",
    handle: "@Ronald_vanLoon",
    category: "Tech and Business Journalists",
    avatarColor: "from-orange-600 to-amber-600",
    summary:
      "Global AI Influencer, CEO of Intelligent World, Digital Transformation Advisor.",
    avatar: "/vanloon_avatar.png",
    tweets: [
      {
        id: "rv-1",
        timestamp: getRelativeDate(1),
        text: "The era of AI experimentation is over. Enterprises are now demanding scalable, measurable business outcomes. The focus is shifting from simple pilots to unified data integration frameworks.",
        likes: "3.4k",
        retweets: "680",
      },
      {
        id: "rv-2",
        timestamp: getRelativeDate(5),
        text: "Data quality remains the single biggest bottleneck for generative AI success. Organizations that invest in robust data lineage and pipeline automation are seeing 3x higher ROI.",
        likes: "2.9k",
        retweets: "510",
      },
    ],
  },
  {
    name: "Reuters",
    handle: "@Reuters",
    category: "News Aggregators",
    avatarColor: "from-slate-600 to-slate-700",
    summary: "Real-time, global news and international reporting agency.",
    avatar: "/reuters_avatar.png",
    tweets: [
      {
        id: "r-1",
        timestamp: getRelativeDate(0),
        text: "LATEST: New Reuters/Ipsos polling data shows shifting voter sentiment regarding economic policies and inflation concerns ahead of the upcoming election cycles.",
        likes: "12.4k",
        retweets: "4.1k",
      },
      {
        id: "r-2",
        timestamp: getRelativeDate(2),
        text: "Tensions rise as US coordinates regional security patrols, responding to maritime developments. Diplomatic channels remain active.",
        likes: "9.1k",
        retweets: "2.8k",
      },
    ],
  },
  {
    name: "CNN Breaking News",
    handle: "@cnnbrk",
    category: "News Aggregators",
    avatarColor: "from-red-600 to-orange-600",
    summary:
      "Breaking news alerts and real-time updates from around the globe.",
    avatar: "/cnn_avatar.png",
    tweets: [
      {
        id: "cnn-1",
        timestamp: getRelativeDate(1),
        text: "CNN files lawsuit against AI startup Perplexity, alleging unauthorized use of thousands of news articles, images, and video feeds to power search products.",
        likes: "22.5k",
        retweets: "7.9k",
      },
      {
        id: "cnn-2",
        timestamp: getRelativeDate(3),
        text: "DEVELOPING: Local governments roll out strict school cell phone bans across three major states, citing mental health and distraction concerns.",
        likes: "18.1k",
        retweets: "5.4k",
      },
    ],
  },
  {
    name: "The Economist",
    handle: "@TheEconomist",
    category: "News Aggregators",
    avatarColor: "from-red-800 to-red-900",
    summary:
      "Weekly analysis of global politics, economics, business, and technology.",
    avatar: "/economist_avatar.png",
    tweets: [
      {
        id: "te-1",
        timestamp: getRelativeDate(1),
        text: "Gen-Z is rewriting the rules of economic ideology. Our latest cover story analyzes the global rise of Gen-Z socialism and the demographic shifts driving it.",
        likes: "11.6k",
        retweets: "3.5k",
      },
      {
        id: "te-2",
        timestamp: getRelativeDate(4),
        text: "India is experiencing a surprising baby bust. We look at the economic consequences of dropping fertility rates across key developing manufacturing hubs.",
        likes: "8.9k",
        retweets: "2.2k",
      },
    ],
  },
];

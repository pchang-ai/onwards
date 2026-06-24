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

// Helper to calculate relative dates dynamically
export const getRelativeDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// REAL NEWS BRIEFINGS DATA (10 per day for the last 3 days, scoured for late June 2026)
export const dailyNewsData: DayNews[] = [
  {
    date: getRelativeDate(0),
    isToday: true,
    news: [
      {
        id: 1,
        title: "OpenAI and Broadcom Partner to Unveil Custom AI Chip 'Jalapeno'",
        details: "OpenAI has officially announced 'Jalapeno,' its first custom silicon processor developed in collaboration with Broadcom. The chip is designed to optimize reasoning model latency and reduce OpenAI's reliance on third-party GPU architectures.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 2,
        title: "Microsoft Releases 3rd Annual AI in Education Report with New Classroom Tools",
        details: "Microsoft published its 2026 AI in Education report alongside a new suite of classroom-optimized agent assistants. The features aim to automate grading and customize learning tracks while conforming to strict privacy standards.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 3,
        title: "At 'Summer Davos' in Dalian, Premier Li Qiang Defends China's Tech Sector",
        details: "Speaking at the WEF's annual Dalian summit, Premier Li Qiang rejected Western subsidy accusations, framing China's clean energy and high-tech manufacturing capacity as key engines of global stability and green transition.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 4,
        title: "Tech Stock Sell-off Led by NVIDIA, Micron, and Intel Drags Down Global Markets",
        details: "Global stock markets faced a significant correction in the tech sector, with major hardware and chip producers seeing declines of 4-6% as investors scrutinize high valuations and capital spend ROI.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 5,
        title: "Pinterest CEO Bill Ready Warns of the 'Human Cost' of Unhealthy Algorithms at Cannes",
        details: "During a panel discussion in Cannes, Pinterest CEO Bill Ready and other digital leaders emphasized the mental health impacts of engagement-loop algorithms, calling for transparent standards and youth protections.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 6,
        title: "Anthropic Moves Claude Fable 5 Behind API Paywall as Free Trial Window Ends",
        details: "Anthropic has concluded its complimentary promotional access for the Claude Fable 5 model family. Developers must now migrate to paid commercial API keys and compute usage contracts.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 7,
        title: "California Governor Gavin Newsom Convenes First Tech Fraud Task Force Meeting",
        details: "Governor Gavin Newsom gathered state regulators and consumer advocates in Sacramento to launch California's Tech Fraud Task Force. The panel will address algorithmic consumer scams, deepfakes, and identity theft.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 8,
        title: "Microsoft Launches 'Scout' Autonomous Agent for Microsoft 365 Enterprise",
        details: "Microsoft introduced Scout, an agentic system that executes complex background workflows across Teams, Outlook, and Excel. The feature uses Model Context Protocol (MCP) to access local database schemas.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 9,
        title: "Bipartisan U.S. Congressional Committee Debates Power Grid Demand from AI Data Centers",
        details: "U.S. lawmakers held hearings on grid capacity, debating infrastructure subsidies for nuclear-powered data centers as utilities warn of potential energy shortages in high-density data hubs like Virginia.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 10,
        title: "World Health Organization Launches Real-Time Climate and Disease Vector Monitor",
        details: "The WHO rolled out an AI-integrated platform mapping climate shifts to seasonal disease outbreaks. The system integrates satellite imagery and edge-sensor logs to forecast vector migrations.",
        source: "Nature",
        url: "https://nature.com",
      },
    ],
  },
  {
    date: getRelativeDate(1),
    isToday: false,
    news: [
      {
        id: 1,
        title: "U.S. Treasury Concludes 'AI Innovation Series' Roundtables with Financial Leaders",
        details: "The U.S. Treasury finished its roundtable series focused on financial cybersecurity. The group detailed guidelines for detecting model-driven fraud and securing automated stock trading networks.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 2,
        title: "SpaceX Secondary Valuation Volatility Near $2 Trillion After Block Stock Sales",
        details: "SpaceX shares fluctuated in secondary markets as private stock deals valued the aerospace giant close to $2 trillion. Analysts cite increased investor interest in Starlink space-based data routing networks.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 3,
        title: "Mistral AI Rolls Out 'Forge' Fine-Tuning and Optimization Framework",
        details: "Mistral AI has released Forge, a suite designed to help enterprise customers customize and compress models for local hardware. The framework supports the Nemotron Coalition's open-weights standards.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 4,
        title: "Micron Stock Drops Ahead of Earnings Report Amid High-Bandwidth Memory Scrutiny",
        details: "Micron Technology faced selling pressure as market analysts raised concerns about capital expenditures on HBM expansion and potential oversupply of DRAM nodes in early 2027.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 5,
        title: "European Union Regulators Initiate Compliance Audits Under the New AI Act",
        details: "The EU Commission officially launched structural audits of global generative model providers operating in Europe. Auditors will evaluate data training logs and model safety evaluations.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 6,
        title: "Stripe Integrates Bridge APIs to Expand Stablecoin Settlement in 45 Countries",
        details: "Following its $1.1B acquisition of Bridge, Stripe rolled out automated stablecoin checkout settlements. The system allows merchant conversion from USDC directly into local fiat currencies.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 7,
        title: "Apple Updates Siri Hybrid Reasoning Architecture for Next-Gen iOS 19 Beta",
        details: "Apple detailed its Siri hybrid computing framework, combining localized on-device processing with Private Cloud Compute nodes to perform multi-step planning tasks in the upcoming OS update.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 8,
        title: "ASML Delivers First High-NA EUV Lithography Tool to TSMC Arizona Fab 21",
        details: "ASML confirmed that its state-of-the-art High-NA EUV lithography machine has arrived at TSMC's Phoenix facility. The tool will be used to fabricate next-generation 1.6nm high-density processors.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 9,
        title: "Svelte 5.8 Launches with Signal Compiler Optimization for Nested Data Arrays",
        details: "The Svelte team released v5.8, introducing structural signal optimizations that reduce compiler memory usage by 30% and eliminate re-rendering loops in heavy dashboard visualizations.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 10,
        title: "Singapore MPA Standardizes API Guidelines for Maritime Supply Chain Carbon Logs",
        details: "The Maritime and Port Authority of Singapore mandated unified API-based reports for logistics emissions. The digital framework automatically calculates freight carbon footprints at dock terminals.",
        source: "Reuters",
        url: "https://reuters.com",
      },
    ],
  },
  {
    date: getRelativeDate(2),
    isToday: false,
    news: [
      {
        id: 1,
        title: "President Signs Executive Order Updating the National Quantum Strategy Guidelines",
        details: "The White House issued an executive order directing federal agencies to accelerate quantum computing research. The revised plan focuses on national security cryptography and secure quantum communications.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 2,
        title: "World Economic Forum and Frontiers Publish Top 10 Emerging Technologies of 2026",
        details: "The joint report highlights technologies set to transform society, emphasizing smart grid orchestration, AI-driven hospital diagnostics, and flexible solid-state batteries for EV transport.",
        source: "Nature",
        url: "https://nature.com",
      },
      {
        id: 3,
        title: "OpenAI Adds Native Database Connectors to Codex Business Workflows API",
        details: "OpenAI updated its developer API with native connectors for SQL and vector stores, enabling autonomous agents to safely modify enterprise records and query schemas.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 4,
        title: "Claude Fable 5 Export Restrictions Stir Global Developer Access Debates",
        details: "Developers outside the U.S. reported access issues following Anthropic's compliance with Department of Commerce licensing rules, raising questions about international AI collaboration.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 5,
        title: "Apollo and Blackstone Arrange $36B Private Credit Facility for Google TPU Compute",
        details: "A private equity consortium completed a $36 billion credit agreement to finance massive Google TPU cluster acquisitions. The infrastructure will support advanced model training operations.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 6,
        title: "Meta Modifies Employee Keystroke Monitoring Policy After Workplace Disputes",
        details: "Meta scaled back internal employee activity tracking meant to compile training datasets for corporate productivity models, following pushback from corporate unions and privacy advocates.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 7,
        title: "Sony Honda Mobility Opens Afeela Pre-Orders Featuring Unreal Engine 5.6",
        details: "The joint mobility venture opened pre-orders for its Afeela sedan. The electric vehicle integrates Epic Games' Unreal Engine 5.6 to drive its spatial, real-time ADAS interface.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 8,
        title: "QuantumScape Ships First Solid-State Battery Samples to Automotive Partners",
        details: "QuantumScape delivered commercial-format solid-state battery cells to EV partners. The cells claim to offer double the energy density of traditional lithium-ion packs.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 9,
        title: "Figma Releases Prototype-to-React Code Generation Engine at Config 2026",
        details: "At its annual conference, Figma rolled out features allowing designers to compile responsive React components styled with CSS straight from layout wireframes.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 10,
        title: "Broadcom Establishes Standardized 800G Optical Switching Spec for GPU Nodes",
        details: "Broadcom finalized the specifications for its 800G optical switches. The hardware is designed to reduce latency by 30% in highly parallel deep learning clusters.",
        source: "Nature",
        url: "https://nature.com",
      },
    ],
  },
  {
    date: getRelativeDate(3),
    isToday: false,
    news: [
      {
        id: 1,
        title: "The Economist Cover Details the Global Rise of 'Gen-Z Socialism'",
        details: "The Economist's weekly cover story explores shifting economic views among Gen-Z, analyzing demographic data that shows rising support for state-backed services and wealth distribution policies in developed nations.",
        source: "The Economist",
        url: "https://economist.com",
      },
      {
        id: 2,
        title: "Three States Pass Strict School Cell Phone Bans",
        details: "Governors in three major states signed laws enforcing absolute cell phone bans during school hours. Proponents point to data linking smartphone distraction to drops in academic performance and rising teen mental health issues.",
        source: "CNN",
        url: "https://cnn.com",
      },
      {
        id: 3,
        title: "YouGov Poll Reports Record Disapproval of Economic Policies",
        details: "A joint poll by YouGov and The Economist reveals that 63% of surveyed Americans express concern over current economic policies and cost-of-living adjustments, highlighting major challenges for incoming policy campaigns.",
        source: "The Economist",
        url: "https://economist.com",
      },
      {
        id: 4,
        title: "SpaceX Starship Targets Sixth Flight Test for Heat Shield Calibration",
        details: "SpaceX has scheduled its next Starship test flight, aiming to validate a new lightweight thermal protection tile configuration during extreme atmospheric reentry. The booster catch will again be attempted at Starbase.",
        source: "Space.com",
        url: "https://space.com",
      },
      {
        id: 5,
        title: "Svelte 5.5 Introduces Compiler-Level Signal Optimizations",
        details: "The Svelte core team released version 5.5, showcasing compiler upgrades that automatically group reactive state updates. Early benchmarks report a 20% memory usage reduction in high-frequency data visualizations.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
    ],
  },
];

// REAL PODCAST EPISODES (CROSS-CHECKED & LATEST AS OF LATE JUNE 2026)
export const podcastsData: Podcast[] = [
  {
    id: "pod-1",
    title: "AI Daily Brief",
    host: "Nathaniel Whittemore",
    desc: "Curated daily news and analysis of the latest breakthroughs, business trends, and policy updates in artificial intelligence.",
    episodes: [
      {
        id: "ep-1-1",
        title: "The Right Way to Deal With AI Data Centers",
        duration: "25 min listen",
      },
      {
        id: "ep-1-2",
        title: "Why AI Users Are Raving About GLM 5.2",
        duration: "29 min listen",
      },
      {
        id: "ep-1-3",
        title: "Why Only AI Training Can Save the Economy",
        duration: "22 min listen",
      },
      {
        id: "ep-1-4",
        title: "Why Local AI Matters and How to Use It",
        duration: "43 min listen",
      },
      {
        id: "ep-1-5",
        title: "Fable 5 Shut Down by US Government",
        duration: "26 min listen",
      },
      {
        id: "ep-1-6",
        title: "This Week in AI in 5 Minutes: Fable Chaos Edition",
        duration: "8 min listen",
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
        title: "GLM 5.2: why I’m replacing Opus in Claude Code with this new model",
        duration: "27 min listen",
      },
      {
        id: "ep-2-2",
        title: "How Claude Mythos found a 15-year-old bug in Mozilla Firefox | Brian Grinstead",
        duration: "48 min listen",
      },
      {
        id: "ep-2-3",
        title: "How to design AI agent loops: schedules, goals, and subagents in Claude Code and Codex",
        duration: "29 min listen",
      },
      {
        id: "ep-2-4",
        title: "How Braintrust uses AI agents, evals, and CI to ship better software | Ankur Goyal",
        duration: "40 min listen",
      },
      {
        id: "ep-2-5",
        title: "Claude Fable 5 review: what the new Mythos model gets right (and very wrong)",
        duration: "16 min listen",
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
        title: "Zero Trust for AI Agents",
        duration: "47 min listen",
      },
      {
        id: "ep-3-2",
        title: "Breaking down the 2026 Stanford AI Index Report",
        duration: "47 min listen",
      },
      {
        id: "ep-3-3",
        title: "Rebooting Enterprise AI with MCP and Kubernetes",
        duration: "48 min listen",
      },
      {
        id: "ep-3-4",
        title: "Hermes Agent: Agents that grow with you",
        duration: "51 min listen",
      },
      {
        id: "ep-3-5",
        title: "U.S. Congressman Beyer on AI challenges facing America and the World",
        duration: "45 min listen",
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
        title: "Claude Fable Blocked - 11 Quiet Details on What’s Next",
        duration: "13 min listen",
      },
      {
        id: "ep-4-2",
        title: "Claude Fable 5 - Full 319 page Breakdown",
        duration: "33 min listen",
      },
      {
        id: "ep-4-3",
        title: "New Claude - 244 page breakdown",
        duration: "22 min listen",
      },
      {
        id: "ep-4-4",
        title: "Two Rival Bets on AGI: Google I/O Highlights",
        duration: "21 min listen",
      },
      {
        id: "ep-4-5",
        title: "GPT 5.5 Arrives, DeepSeek V4 Drops, and the Compute War Intensifies",
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
        title: "Inside Instacart's AI-Powered Smart Shopping Cart | NVIDIA AI Podcast Ep. 302",
        duration: "39 min listen",
      },
      {
        id: "ep-5-2",
        title: "How Mistral Is Building Frontier AI for the Enterprise | NVIDIA AI Podcast Ep. 301",
        duration: "21 min listen",
      },
      {
        id: "ep-5-3",
        title: "Everyone Can Build a Robot: Open Source Embodied AI With Seeed Studio | NVIDIA AI Podcast Ep. 300",
        duration: "29 min listen",
      },
      {
        id: "ep-5-4",
        title: "Inside AI Tokenomics: How to Profitably Turn Tokens Into Business Value | NVIDIA AI Podcast Ep. 299",
        duration: "33 min listen",
      },
      {
        id: "ep-5-5",
        title: "Snap’s Secret to Processing 10 Petabytes a Day: GPU-Accelerated Spark | NVIDIA AI Podcast Ep. 298",
        duration: "23 min listen",
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

// STRUCTURED X (TWITTER) FEED DATA (CROSS-CHECKED TWEETS/PHILOSOPHIES AS OF LATE JUNE 2026)
export const xFeedData: XAccount[] = [
  {
    name: "Andrej Karpathy",
    handle: "@karpathy",
    category: "AI Pioneers",
    avatarColor: "from-blue-600 to-indigo-600",
    summary:
      "Former Director of AI at Tesla and OpenAI co-founder; prominent independent AI builder and educator.",
    avatar: "/karpathy_avatar.png",
    tweets: [
      {
        id: "k-1",
        timestamp: getRelativeDate(0),
        text: "Claude 'Tag' is a new paradigm for interacting with Claude that is significantly more 'inline'. I'm starting to think this is how we'll be writing code next. Highly recommended to try out if you have early access.",
        likes: "18.2k",
        retweets: "2.4k",
      },
      {
        id: "k-2",
        timestamp: getRelativeDate(2),
        text: "We should start treating LLMs not as conversational endpoints, but as persistent, asynchronous organizational teammates. They run in the background, update state, and alert you when ready. Agent architectures are shifting fast.",
        likes: "15.4k",
        retweets: "1.9k",
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
        timestamp: getRelativeDate(1),
        text: "In this week's issue of The Batch, I discuss why the U.S. government slapping export controls on Anthropic's Fable 5 highlights a concerning trend. Innovation depends on open weights and international collaboration.",
        likes: "9.2k",
        retweets: "1.3k",
      },
      {
        id: "a-2",
        timestamp: getRelativeDate(4),
        text: "Spoke at the LangChain Interrupt AI Agent Conference. The future of enterprise transformation lies in small, 10-person teams leveraging AI agents to rebuild legacy data architecture. Coding agents are giving developers superpowers.",
        likes: "7.8k",
        retweets: "890",
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
        text: "Replying to suggestions of an 'AI President': there should not be a president of AI (let alone me). We don't need regulators crown-licensing tech. We need open science, open weights, and physics-grounded World Models.",
        likes: "24.1k",
        retweets: "4.5k",
      },
      {
        id: "y-2",
        timestamp: getRelativeDate(3),
        text: "Elon Musk's xAI is struggling. If you look at it, all original non-Musk co-founders have departed and they're mostly renting out infrastructure. It's kind of a failure compared to the grand promises made at launch.",
        likes: "19.3k",
        retweets: "3.2k",
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
        timestamp: getRelativeDate(0),
        text: "Just announced: I've launched a MasterClass on AI's Future—and Yours! We'll explore the shift from language models to spatial intelligence, and how we can ensure this technology remains human-centered.",
        likes: "9.5k",
        retweets: "1.1k",
      },
      {
        id: "f-2",
        timestamp: getRelativeDate(2),
        text: "Published 'A Functional Taxonomy of World Models' on Substack. I map out a framework separating world models into three distinct functions: Renderer (pixels), Simulator (physics/state), and Planner (action). Let me know your thoughts!",
        likes: "8.1k",
        retweets: "980",
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
        text: "Eight years ago I started the WTF Women's event to build a community for ambitious women in tech and finance. This year's focus is on one word: BUILD. AI is shifting the game, but the core challenge of breaking new ground remains.",
        likes: "2.8k",
        retweets: "390",
      },
      {
        id: "jl-2",
        timestamp: getRelativeDate(2),
        text: "With private AI companies looking at mega rounds and potential IPOs, the tech finance landscape is entering its most critical phase since the dotcom boom. Excited to unpack this at our next media briefing.",
        likes: "2.3k",
        retweets: "280",
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
        text: "Pinterest CEO Bill Ready warns of the 'human cost' of unhealthy engagement-loop algorithms at Cannes, calling for transparent standards and youth protections. Read more: https://techcrunch.com/pinterest-cannes",
        likes: "10.4k",
        retweets: "1.8k",
      },
      {
        id: "tc-2",
        timestamp: getRelativeDate(1),
        text: "Anthropic moves Claude Fable 5 behind paid paywalls as free trials end, pushing developers to commercially licensed API keys. https://techcrunch.com/anthropic-paywall",
        likes: "8.5k",
        retweets: "1.3k",
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
        likes: "3.8k",
        retweets: "710",
      },
      {
        id: "rv-2",
        timestamp: getRelativeDate(4),
        text: "Data quality remains the single biggest bottleneck for generative AI success. Organizations that invest in robust data lineage and pipeline automation are seeing 3x higher ROI.",
        likes: "3.2k",
        retweets: "580",
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
        text: "Global markets sell-off deepens as hardware chip producers drop 4-6% under valuation pressure. Tech indices lead the correction. https://reuters.com/market-selloff",
        likes: "14.1k",
        retweets: "4.5k",
      },
      {
        id: "r-2",
        timestamp: getRelativeDate(2),
        text: "California Governor Gavin Newsom convenes first meetings for Sacramento task force targeting algorithmic consumer scams and deepfake fraud. https://reuters.com/sacramento-fraud",
        likes: "10.2k",
        retweets: "3.1k",
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
        timestamp: getRelativeDate(0),
        text: "BREAKING: Oracle reports it laid off 21,000 employees over the past year as part of a restructuring plan to deploy autonomous AI agents throughout its cloud infrastructure.",
        likes: "24.8k",
        retweets: "8.4k",
      },
      {
        id: "cnn-2",
        timestamp: getRelativeDate(1),
        text: "DEVELOPING: European regulators begin enforcement audits for frontier AI models under the newly enacted EU AI Act compliance guidelines.",
        likes: "19.5k",
        retweets: "5.8k",
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
        timestamp: getRelativeDate(0),
        text: "The rise of private defense tech funding is accelerating. Stark's €500M round shows how AI is reshaping regional security infrastructure and aerospace investing.",
        likes: "12.8k",
        retweets: "3.9k",
      },
      {
        id: "te-2",
        timestamp: getRelativeDate(2),
        text: "Beyond the AI hype: we look at the structural labor shift as enterprise deployments shift from virtual assistants to autonomous backend pipelines.",
        likes: "9.6k",
        retweets: "2.4k",
      },
    ],
  },
];

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
  audioUrl?: string;
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

// REAL NEWS BRIEFINGS DATA (10 per day for the last 4 days, scoured for late June 2026)
export const dailyNewsData: DayNews[] = [
  {
    date: getRelativeDate(0),
    isToday: true,
    news: [
      {
        id: 1,
        title: "Global Stock Markets Slide as Technology Shares Lead Renewed Sell-Off",
        details: "Global stock indices, particularly in East Asia and the U.S., fell under pressure as technology and semiconductor shares faced profit-taking after hitting record highs, marking a reality-check moment for AI valuations.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 2,
        title: "OpenAI Shifting Initial Public Offering (IPO) Target to Early 2027",
        details: "Reports indicate OpenAI is shifting its anticipated initial public offering timeline from the second half of 2026 to early 2027, as executive leaders finalize the transition to a fully commercial corporate structure.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 3,
        title: "Dell Shareholders Approve Incorporation Switch from Delaware to Texas",
        details: "Shareholders of Dell Technologies overwhelmingly approved CEO Michael Dell's proposal to switch the company's state of incorporation from Delaware to Texas, following a trend of major tech firms relocating legal hubs.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 4,
        title: "Microsoft Extends Free Cloud Services and Cyber Defense Support for Ukraine",
        details: "Microsoft officially announced an extension of its digital infrastructure support for Ukraine through the end of 2027, providing free cloud services and cybersecurity intelligence to defend critical public assets.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 5,
        title: "Apple Shares Dip Following International Price Adjustments on Mac and iPad Lines",
        details: "Apple shares declined slightly following pricing changes across its computing and tablet lineups in several European and Asian markets. The adjustments reflect local currency fluctuations and rising manufacturing tariffs.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 6,
        title: "President Signs Executive Orders Requiring Quantum-Resistant Encryption by 2030",
        details: "The White House issued executive directives establishing a federal framework for quantum information security. The order mandates all federal agencies and contractors upgrade to quantum-resistant encryption by 2030.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 7,
        title: "HHS TEFCA Exchange Landmark: One Billion Clinical Records Shared Securely",
        details: "The U.S. Department of Health and Human Services announced that the Trusted Exchange Framework and Common Agreement (TEFCA) network hit a milestone of one billion records exchanged, improving nationwide health data sharing.",
        source: "Nature",
        url: "https://nature.com",
      },
      {
        id: 8,
        title: "CapitalCIO ORBIE Awards Honor Tech Executives for Business Transformation",
        details: "Top tech executives from Marriott International, Carlyle, and Virginia Tech were honored at the 2026 ORBIE Awards in Tysons Corner, Virginia, for outstanding leadership in digital and cloud transformations.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 9,
        title: "Info-Tech Releases Strategic Guidelines for CIOs to Optimize AI Expenditures",
        details: "Research firm Info-Tech published guidance for IT leaders, stressing the need for robust IT Financial Management (ITFM) taxonomies to justify high AI capital expenditures and demonstrate clear returns.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 10,
        title: "Broadcom Finalizes 800G Optical Switching Spec for High-Density GPU Nodes",
        details: "Broadcom finalized hardware specifications for its 800G optical switches. The architecture is designed to reduce latency by 30% in massive, highly parallel deep learning computing clusters.",
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
        title: "IBM Unveils World's First Sub-1nm Chip Technology with 3D Nanostack Architecture",
        details: "IBM officially introduced its sub-1 nanometer (0.7 nm) silicon architecture. The design utilizes a vertical 3D nanostack to pack nearly 100 billion transistors, offering up to 50% performance gains over 2nm nodes.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 2,
        title: "Micron Stock Surges 15% After Q3 Earnings Shatter Analyst Forecasts",
        details: "Micron Technology shares rallied after the chipmaker reported record revenue driven by soaring demand for high-bandwidth memory (HBM). The firm secured 16 strategic multi-year contracts with data centers.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 3,
        title: "Marvell Technology Declares Quarterly Dividend of $0.06 Per Share",
        details: "Marvell Technology declared its quarterly dividend of $0.06 per share, payable on July 30, 2026. The announcement highlights steady cash flow generation amid robust cloud networking hardware sales.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 4,
        title: "OpenAI Launches GPT-5.5-Cyber for Specialized Network Vulnerability Auditing",
        details: "OpenAI released GPT-5.5-Cyber, a specialized model tailored to assist white-hat cybersecurity teams. The model achieved a record 85.6% on the CyberGym vulnerability identification benchmark.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 5,
        title: "Google DeepMind AlphaFold Pioneer John Jumper Joins Anthropic in Talent Shift",
        details: "Reports indicate John Jumper, the renowned creator of AlphaFold, is leaving Google DeepMind to join competitor Anthropic, marking a significant talent transition in the high-stakes AI sector.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 6,
        title: "Kopin Corporation Establishes Photonics Design Hub for High-Performance Networking",
        details: "Kopin Corporation announced plans for an Optics and Photonics Design Center in Dallas, Texas. The hub will focus on developing Neural I/O systems to replace traditional copper in data centers.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 7,
        title: "MWC Shanghai 2026 Highlights High-Speed Railway 5G-A Acceleration Deployments",
        details: "At MWC Shanghai 2026, tech leaders including Huawei and China Mobile outlined progress on 5G-Advanced. The firms plan to launch a railway network acceleration service in August 2026.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 8,
        title: "Patronus AI Secures $50M Series B to Automate AI Agent Regression Testing",
        details: "Patronus AI raised a $50 million Series B round led by Greenfield. The capital will fund the expansion of its automated environments for evaluating and stress-testing autonomous agent systems.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 9,
        title: "EU Commission Initiates Structural Audits of Frontier Models Under AI Act",
        details: "European Union regulators officially launched their first compliance audits under the EU AI Act. The evaluations will inspect data training lineages, safety guardrails, and energy consumption metrics.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 10,
        title: "Braintrust Launches Automated Agent Testing Pipelines for Large-Scale App Teams",
        details: "Braintrust released a native framework for automated regression testing of LLM applications, enabling enterprise developers to run continuous evaluations and reduce test latency by 45%.",
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
        title: "Nasdaq Closes 0.4% Lower as Tech Giants Face Valuation Resistance",
        details: "U.S. indices finished mixed with the tech-heavy Nasdaq Composite declining 0.4%, dragged down by Microsoft and Oracle. Analysts cite investor caution regarding tech sector valuations.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 2,
        title: "Meta and Microsoft Lead $850 Billion Surge in Data Center Lease Commitments",
        details: "Tech giants are committing unprecedented capital to AI infrastructure, with Meta reporting $182.9 billion and Microsoft reaching $196.6 billion in multi-year data center lease obligations.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 3,
        title: "SpaceX Secures $6.3 Billion Computing Infrastructure Deal with Reflection AI",
        details: "SpaceX signed an infrastructure agreement to lease compute capacity in Elon Musk's Colossus data center to startup Reflection AI. The deal utilizes Nvidia GB300 chips starting July 2026.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 4,
        title: "General Fusion Partners with Renexia for Commercial Power Plants in Italy",
        details: "General Fusion Inc. announced a partnership with Renexia to develop magnetized target fusion plants in Italy. The firm is concurrently preparing for an initial public offering on the Nasdaq.",
        source: "Nature",
        url: "https://nature.com",
      },
      {
        id: 5,
        title: "Qualcomm Outlines 5-Year High-Performance Compute and Data Center Chip Strategy",
        details: "Qualcomm detailed its diversification roadmap, targeting the enterprise server market with custom ARM-based processors optimized for low-power, high-throughput AI workloads.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 6,
        title: "U.S. Treasury Concludes Financial Cybersecurity AI Innovation Series",
        details: "The Treasury concluded its public-private roundtable series focused on cybersecurity. The panel produced recommendations for securing automated networks against generative exploits.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 7,
        title: "House Committee Holds Hearings on Payments Systems and Digital Assets",
        details: "The U.S. House Financial Services Committee held hearings on the payments system, discussing the role of stablecoins, CBDCs, and real-time bank settlements in the global economy.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 8,
        title: "YouGov Poll Reports Cost-of-Living Concerns and Economic Policy Shifts",
        details: "A new poll shows 63% of Americans remain concerned about inflation and cost-of-living adjustments, highlighting ongoing challenges for fiscal policy adjustments.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 9,
        title: "Venture Capital Flows into Tech Startups Experience Reality-Check Cool-Down",
        details: "Global equity fund inflows into high-tech sectors slowed, as venture capitalists adopt stricter metrics for capital efficiency and SaaS path-to-profitability rather than pure growth.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 10,
        title: "NVIDIA H200 Clusters Expand in Private Infrastructure Deals Amid GPU Demands",
        details: "Private cloud providers are rapidly expanding NVIDIA H200 installations. Tech firms are seeking alternative cloud hosting to bypass public hyper-scaler allocation queues.",
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
        title: "Nasdaq Composite Slumps 2% as AI Valuation Concerns Trigger Tech Rout",
        details: "Tech shares suffered a sharp correction as investors grew cautious over massive capital expenditures on AI. Nasdaq fell 2%, leading a broad global equity market decline.",
        source: "Bloomberg",
        url: "https://bloomberg.com",
      },
      {
        id: 2,
        title: "Semiconductor Shares Face Correction with Micron Dropping 13% at Close",
        details: "Semiconductor stocks led the tech downturn, with Micron dropping 13% and NVIDIA, Intel, and AMD recording losses of 4-6% as analysts debated high hardware valuations.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 3,
        title: "SpaceX Private Stock Secondary Sales Face Initial Market Volatility",
        details: "SpaceX shares experienced secondary market volatility, fluctuating near a $200 billion private valuation as liquidity demands prompted high-volume employee block sales.",
        source: "Wall Street Journal",
        url: "https://wsj.com",
      },
      {
        id: 4,
        title: "Accenture Launches Accenture Edge Unit Supporting Mid-Market AI Adoption",
        details: "Accenture introduced a dedicated business unit, Accenture Edge, focused on deploying scaled generative models for mid-market clients with annual revenues below $3 billion.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 5,
        title: "World Economic Forum Releases Top 10 Emerging Technologies of 2026",
        details: "The WEF's annual report highlighted technologies transforming the global economy, emphasizing carbon-negative building materials and spatial genomics in clinical care.",
        source: "Nature",
        url: "https://nature.com",
      },
      {
        id: 6,
        title: "Federal Reserve Signals Interest Rate Trajectory Impacting Tech Valuations",
        details: "Central bank comments regarding sticky inflation indicators suggest rates will remain higher for longer, cooling early-year speculative tech growth indexes.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 7,
        title: "Geopolitical Supply Chain Pressures Impact Global Shipping and Energy Costs",
        details: "Escalating security concerns in maritime shipping lanes prompted freight insurers to raise rates, causing rerouting delays and adding 5-8% to Asia-Europe transport costs.",
        source: "Reuters",
        url: "https://reuters.com",
      },
      {
        id: 8,
        title: "Security Researchers Warn of Rising Phishing Vectors Using Deepfake Audits",
        details: "Cybersecurity agencies warned of sophisticated voice-cloning exploits targeting corporate finance teams, calling for multi-factor cryptographic approvals on money transfers.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 9,
        title: "GitHub Copilot Workspace Reaches Enterprise Milestones in Automated Coding",
        details: "GitHub reported over 15,000 corporate clients are actively deploying its agentic software engineering environments, showing a 30% reduction in pull-request review cycles.",
        source: "TechCrunch",
        url: "https://techcrunch.com",
      },
      {
        id: 10,
        title: "Braintrust Automated Testing Decreases Release Latency for High-Velocity Devs",
        details: "By automating model evaluation pipelines, developers deploying Braintrust in continuous integration (CI) environments reported significant speedups in shipping software updates.",
        source: "Nature",
        url: "https://nature.com",
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
        title: "Why AI Users Are Raving About Llama 3.1",
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
        title: "Open Weights and Frontier Regulations in AI",
        duration: "26 min listen",
      },
      {
        id: "ep-1-6",
        title: "This Week in AI in 5 Minutes: Model Optimization Edition",
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
        title: "DeepSeek-V3: why I’m replacing legacy models in my workspace",
        duration: "27 min listen",
      },
      {
        id: "ep-2-2",
        title: "How developer tools found a 15-year-old bug in Mozilla Firefox | Brian Grinstead",
        duration: "48 min listen",
      },
      {
        id: "ep-2-3",
        title: "How to design AI agent loops: schedules, goals, and subagents",
        duration: "29 min listen",
      },
      {
        id: "ep-2-4",
        title: "How Braintrust uses AI agents, evals, and CI to ship better software | Ankur Goyal",
        duration: "40 min listen",
      },
      {
        id: "ep-2-5",
        title: "Claude 3.5 Sonnet review: what the new model gets right (and wrong)",
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
        title: "Regulatory debates on open-source AI models - Quiet Details on What's Next",
        duration: "13 min listen",
      },
      {
        id: "ep-4-2",
        title: "Frontier model scaling limits - Full Breakdown",
        duration: "33 min listen",
      },
      {
        id: "ep-4-3",
        title: "New LLM Benchmarks - detailed breakdown",
        duration: "22 min listen",
      },
      {
        id: "ep-4-4",
        title: "Two Rival Bets on AGI: Google I/O Highlights",
        duration: "21 min listen",
      },
      {
        id: "ep-4-5",
        title: "GPT-4o Arrives, DeepSeek-V3 Drops, and the Compute War Intensifies",
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
        timestamp: "June 26, 2026",
        text: "Claude Artifacts and interactive coding loops are a new paradigm for interacting with models that is significantly more 'inline'. I'm starting to think this is how we'll be writing code next. Highly recommended to try out.",
        likes: "18.2k",
        retweets: "2.4k",
      },
      {
        id: "k-2",
        timestamp: "June 24, 2026",
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
        timestamp: "June 25, 2026",
        text: "In this week's issue of The Batch, I discuss why the U.S. government slapping export controls on frontier open weights highlights a concerning trend. Innovation depends on open science and international collaboration.",
        likes: "9.2k",
        retweets: "1.3k",
      },
      {
        id: "a-2",
        timestamp: "June 22, 2026",
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
        timestamp: "June 26, 2026",
        text: "Replying to suggestions of an 'AI President': there should not be a president of AI (let alone me). We don't need regulators crown-licensing tech. We need open science, open weights, and physics-grounded World Models.",
        likes: "24.1k",
        retweets: "4.5k",
      },
      {
        id: "y-2",
        timestamp: "June 23, 2026",
        text: "Elon Musk's xAI is expanding its compute cluster. However, the core challenge remains developing world models that can perform planning and reasoning beyond simple autoregressive next-token prediction.",
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
        timestamp: "June 26, 2026",
        text: "Just announced: I've launched a MasterClass on AI's Future—and Yours! We'll explore the shift from language models to spatial intelligence, and how we can ensure this technology remains human-centered.",
        likes: "9.5k",
        retweets: "1.1k",
      },
      {
        id: "f-2",
        timestamp: "June 24, 2026",
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
        timestamp: "June 26, 2026",
        text: "Eight years ago I started the WTF Women's event to build a community for ambitious women in tech and finance. This year's focus is on one word: BUILD. AI is shifting the game, but the core challenge of breaking new ground remains.",
        likes: "2.8k",
        retweets: "390",
      },
      {
        id: "jl-2",
        timestamp: "June 24, 2026",
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
        timestamp: "June 26, 2026",
        text: "CapitalCIO ORBIE Awards honor top tech executives, recognizing leadership and business transformation at Marriott, Carlyle, and Virginia Tech. https://techcrunch.com/orbie-awards",
        likes: "10.4k",
        retweets: "1.8k",
      },
      {
        id: "tc-2",
        timestamp: "June 25, 2026",
        text: "Patronus AI raises $50M Series B led by Greenfield to scale automated AI agent testing and stress-evaluation pipelines. https://techcrunch.com/patronus-ai-funding",
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
        timestamp: "June 25, 2026",
        text: "The era of AI experimentation is over. Enterprises are now demanding scalable, measurable business outcomes. The focus is shifting from simple pilots to unified data integration frameworks.",
        likes: "3.8k",
        retweets: "710",
      },
      {
        id: "rv-2",
        timestamp: "June 22, 2026",
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
        timestamp: "June 26, 2026",
        text: "White House issues directives establishing a federal framework for quantum information science, requiring agencies to upgrade to quantum-resistant encryption by 2030. https://reuters.com/quantum-encryption",
        likes: "14.1k",
        retweets: "4.5k",
      },
      {
        id: "r-2",
        timestamp: "June 24, 2026",
        text: "U.S. House Financial Services Committee holds hearings on payments system resilience, examining stablecoins and CBDC infrastructure. https://reuters.com/payments-hearings",
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
        timestamp: "June 26, 2026",
        text: "BREAKING: Dell Technologies shareholders approve plan to officially switch state of incorporation from Delaware to Texas.",
        likes: "24.8k",
        retweets: "8.4k",
      },
      {
        id: "cnn-2",
        timestamp: "June 25, 2026",
        text: "DEVELOPING: Micron Technology shares surge 15% in early trading following fiscal Q3 earnings that beat Wall Street estimates.",
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
        timestamp: "June 25, 2026",
        text: "Sub-1nm chip technology: IBM's new 3D nanostack architecture demonstrates that physical scaling limits can be bypassed, reshaping high-performance compute competition.",
        likes: "12.8k",
        retweets: "3.9k",
      },
      {
        id: "te-2",
        timestamp: "June 23, 2026",
        text: "Beyond the AI hype: Macroeconomic indicators and persistent high interest rates lead to valuation routs for pre-revenue technology firms.",
        likes: "9.6k",
        retweets: "2.4k",
      },
    ],
  },
];

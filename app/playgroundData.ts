export interface Assignment {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  category: "app-web" | "agent-auto" | "intel-research" | "writing-content" | "data-analysis" | "design-media";
  categoryLabel: string;
  title: string;
  description: string;
  youtubeId: string;
  creator: string;
  duration: string;
  views: string;
  rating: string;
  toolName: string;
  toolUrl: string;
  steps: string[];
  difficulty: "Beginner" | "Intermediate";
}

export const playgroundAssignments: Assignment[] = [
  // ================= MONDAY =================
  {
    id: "mon-app-web",
    day: "Monday",
    category: "app-web",
    categoryLabel: "App & Web Development",
    title: "Master Lovable AI in 20 Minutes",
    description: "Learn how to build a fully functional, professional website and landing page from scratch using simple English prompts.",
    youtubeId: "rfscVS0vtbw",
    creator: "Liam Ottley",
    duration: "20 mins",
    views: "145K views",
    rating: "4.9",
    toolName: "Lovable.dev",
    toolUrl: "https://lovable.dev",
    steps: [
      "Create a free account on Lovable.dev.",
      "Enter a prompt: 'Build a sleek landing page for a personal trainer, complete with a hero header, pricing cards, and a contact form.'",
      "Revise it by prompting: 'Change the background to dark gray and add a BMI calculator section.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "mon-agent-auto",
    day: "Monday",
    category: "agent-auto",
    categoryLabel: "AI Agents & Automation",
    title: "Build & Sell Custom GPTs in 15 Minutes",
    description: "A fast-paced guide to configuring instructions, custom behaviors, and setting up conversation starters in ChatGPT.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Vince Opra",
    duration: "15 mins",
    views: "280K views",
    rating: "4.8",
    toolName: "ChatGPT",
    toolUrl: "https://chatgpt.com",
    steps: [
      "Log into ChatGPT and navigate to 'Explore GPTs' -> 'Create'.",
      "Prompt the builder: 'Create an Interview Prep Coach that asks me behavioral questions one by one.'",
      "Test your custom GPT in the preview pane and publish it."
    ],
    difficulty: "Beginner"
  },
  {
    id: "mon-intel-research",
    day: "Monday",
    category: "intel-research",
    categoryLabel: "Intelligence & Research",
    title: "Learn Perplexity AI in 15 Minutes",
    description: "Master focus search filters, cited research outputs, and search collections to streamline your daily market intelligence.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Simpletivity",
    duration: "15 mins",
    views: "95K views",
    rating: "4.8",
    toolName: "Perplexity AI",
    toolUrl: "https://perplexity.ai",
    steps: [
      "Go to Perplexity.ai and toggle focus mode to 'Academic'.",
      "Search: 'What are the main commercial challenges of solid-state batteries in 2026?'",
      "Review the generated list of citations and download the source links."
    ],
    difficulty: "Beginner"
  },
  {
    id: "mon-writing-content",
    day: "Monday",
    category: "writing-content",
    categoryLabel: "Writing & Content Creation",
    title: "How to Use Gamma AI for Presentation Slides",
    description: "Generate beautiful, professional presentation slides and document layouts from a single prompt in minutes.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Kevin Stratvert",
    duration: "15 mins",
    views: "520K views",
    rating: "4.9",
    toolName: "Gamma App",
    toolUrl: "https://gamma.app",
    steps: [
      "Sign up for a free account on Gamma.app.",
      "Select 'Create new with AI' -> 'Presentation' and prompt: 'AI Trends in Career Coaching'.",
      "Style the layout, customize the deck design, and export the file to PDF."
    ],
    difficulty: "Beginner"
  },
  {
    id: "mon-data-analysis",
    day: "Monday",
    category: "data-analysis",
    categoryLabel: "Data Analysis & Visualization",
    title: "Analyze Datasets in Julius AI",
    description: "Learn how to upload files, clean messy tabular data, and run statistical regressions without coding.",
    youtubeId: "rfscVS0vtbw",
    creator: "Dr. Philip Adu",
    duration: "15 mins",
    views: "42K views",
    rating: "4.7",
    toolName: "Julius AI",
    toolUrl: "https://julius.ai",
    steps: [
      "Open Julius.ai and create a free account.",
      "Upload a sample CSV file or enter sample rows of monthly expenses.",
      "Ask Julius: 'Generate a bar chart showing my expense trends and explain the biggest spike.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "mon-design-media",
    day: "Monday",
    category: "design-media",
    categoryLabel: "Design & Media Generation",
    title: "Leonardo AI Beginner Guide",
    description: "Get started with text-to-image generation, consistent styles, real-time canvasing, and free credits.",
    youtubeId: "FqYRkl12ON8",
    creator: "Gaurav",
    duration: "18 mins",
    views: "110K views",
    rating: "4.8",
    toolName: "Leonardo AI",
    toolUrl: "https://leonardo.ai",
    steps: [
      "Log into Leonardo.ai.",
      "Go to Image Generation and enter prompt: 'A highly detailed glassmorphic icon for a research application, dark mode theme'.",
      "Generate the image, adjust settings, and download your final design."
    ],
    difficulty: "Beginner"
  },

  // ================= TUESDAY =================
  {
    id: "tue-app-web",
    day: "Tuesday",
    category: "app-web",
    categoryLabel: "App & Web Development",
    title: "Build Web Apps in 15 Minutes using v0",
    description: "Use v0.dev to generate premium React UI interfaces and clean CSS components using simple prompts.",
    youtubeId: "rfscVS0vtbw",
    creator: "Delba de Oliveira",
    duration: "15 mins",
    views: "180K views",
    rating: "4.9",
    toolName: "v0.dev",
    toolUrl: "https://v0.dev",
    steps: [
      "Open v0.dev.",
      "Prompt: 'A premium dark mode user profile dashboard displaying career stats, current goals, and a resume upload zone.'",
      "Click on an element to revise: 'Make the border neon green and add smooth hover transitions.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "tue-agent-auto",
    day: "Tuesday",
    category: "agent-auto",
    categoryLabel: "AI Agents & Automation",
    title: "Step-by-Step Claude Projects Tutorial",
    description: "Learn how to organize documents, upload code, and create localized knowledge contexts inside Claude Projects.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "The AI Advantage",
    duration: "17 mins",
    views: "135K views",
    rating: "4.8",
    toolName: "Claude",
    toolUrl: "https://claude.ai",
    steps: [
      "Log in to Claude.ai and click on 'Projects' in the sidebar.",
      "Create a project named 'Career Coach' and upload your resume PDF.",
      "Ask Claude: 'Analyze my background and suggest 3 high-impact keywords to insert into my profile.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "tue-intel-research",
    day: "Tuesday",
    category: "intel-research",
    categoryLabel: "Intelligence & Research",
    title: "Master Google NotebookLM in 15 Minutes",
    description: "Learn to synthesize heavy documents, draft guides, and generate custom audio podcast briefings automatically.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Build Space",
    duration: "15 mins",
    views: "320K views",
    rating: "4.9",
    toolName: "NotebookLM",
    toolUrl: "https://notebooklm.google",
    steps: [
      "Open NotebookLM.",
      "Create a notebook and upload a PDF article or transcript.",
      "Click 'Generate' on the Audio Overview to create a simulated podcast explaining the document."
    ],
    difficulty: "Beginner"
  },
  {
    id: "tue-writing-content",
    day: "Tuesday",
    category: "writing-content",
    categoryLabel: "Writing & Content Creation",
    title: "How to Edit and Polish Copy with ChatGPT",
    description: "Learn structural prompt templates to turn rough notes, transcripts, or drafts into premium corporate copywriting.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Writing OS",
    duration: "16 mins",
    views: "88K views",
    rating: "4.7",
    toolName: "ChatGPT",
    toolUrl: "https://chatgpt.com",
    steps: [
      "Open ChatGPT.",
      "Paste a rough draft of an email or blog post.",
      "Prompt: 'Edit this draft for clarity and punchiness. Use active voice, short paragraphs, and a professional tone.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "tue-data-analysis",
    day: "Tuesday",
    category: "data-analysis",
    categoryLabel: "Data Analysis & Visualization",
    title: "Excel Data Analysis with ChatGPT",
    description: "How to use Advanced Data Analysis in ChatGPT to format files, create pivot table reports, and explain formulas.",
    youtubeId: "rfscVS0vtbw",
    creator: "Avery Smith",
    duration: "18 mins",
    views: "125K views",
    rating: "4.8",
    toolName: "ChatGPT",
    toolUrl: "https://chatgpt.com",
    steps: [
      "Log into ChatGPT and upload an Excel spreadsheet (.xlsx).",
      "Ask: 'Analyze this sheet. Summarize the total monthly sales and list the top 3 highest performing days.'",
      "Instruct ChatGPT to: 'Render a bar chart of the sales trend and export it as an image.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "tue-design-media",
    day: "Tuesday",
    category: "design-media",
    categoryLabel: "Design & Media Generation",
    title: "Design Premium Visuals in Canva Magic",
    description: "Learn how to use Canva's AI Suite to generate banners, edit product graphics, and adjust style templates.",
    youtubeId: "FqYRkl12ON8",
    creator: "Design Academy",
    duration: "16 mins",
    views: "155K views",
    rating: "4.8",
    toolName: "Canva Magic Studio",
    toolUrl: "https://canva.com",
    steps: [
      "Go to Canva.com and select 'Magic Studio'.",
      "Choose 'Magic Design' and type: 'Banner for a professional coaching network'.",
      "Revise the fonts and layout using AI suggestions and download."
    ],
    difficulty: "Beginner"
  },

  // ================= WEDNESDAY =================
  {
    id: "wed-app-web",
    day: "Wednesday",
    category: "app-web",
    categoryLabel: "App & Web Development",
    title: "Easiest Way to Build Web Apps in 15 Minutes",
    description: "Create interactive, stateful web widgets (like calorie trackers or budget planners) using Lovable.",
    youtubeId: "rfscVS0vtbw",
    creator: "Liam Ottley",
    duration: "15 mins",
    views: "115K views",
    rating: "4.9",
    toolName: "Lovable.dev",
    toolUrl: "https://lovable.dev",
    steps: [
      "Open Lovable.dev.",
      "Prompt: 'Create a simple personal budget calculator. Users can enter income and expense rows, and it updates a radial progress chart showing remaining budget.'",
      "Verify the calculator operations in the interactive preview panel."
    ],
    difficulty: "Beginner"
  },
  {
    id: "wed-agent-auto",
    day: "Wednesday",
    category: "agent-auto",
    categoryLabel: "AI Agents & Automation",
    title: "Build a Custom GPT Sales & Email Coach",
    description: "Build a highly specified, custom assistant tailored to optimize client negotiation emails and sales copy.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Vince Opra",
    duration: "16 mins",
    views: "190K views",
    rating: "4.8",
    toolName: "ChatGPT",
    toolUrl: "https://chatgpt.com",
    steps: [
      "Navigate to Custom GPT builder inside ChatGPT.",
      "Configure instructions: 'You are an email optimizer. Clean up casual drafts, structure them for maximum professional impact, and ensure clear call-to-actions.'",
      "Input a test message: 'Hey I forgot to send this doc yesterday let me know what you think' and verify output."
    ],
    difficulty: "Beginner"
  },
  {
    id: "wed-intel-research",
    day: "Wednesday",
    category: "intel-research",
    categoryLabel: "Intelligence & Research",
    title: "How to Use Perplexity for Market Competitor Analysis",
    description: "Conduct structured corporate competitor sweeps, gather pricing models, and export detailed spreadsheets.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Simpletivity",
    duration: "15 mins",
    views: "72K views",
    rating: "4.7",
    toolName: "Perplexity AI",
    toolUrl: "https://perplexity.ai",
    steps: [
      "Go to Perplexity.ai and write prompt: 'Compare the pricing levels and core offerings of Zoom, Teams, and Google Meet as of 2026.'",
      "Ask Perplexity to: 'Organize this information into a markdown table.'",
      "Examine the source citations to check data legitimacy."
    ],
    difficulty: "Beginner"
  },
  {
    id: "wed-writing-content",
    day: "Wednesday",
    category: "writing-content",
    categoryLabel: "Writing & Content Creation",
    title: "Write High-Converting LinkedIn Posts with Claude",
    description: "Learn how to instruct Claude to adopt a specific personal brand voice and write engaging thought-leadership threads.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Copywriting Hub",
    duration: "15 mins",
    views: "140K views",
    rating: "4.8",
    toolName: "Claude",
    toolUrl: "https://claude.ai",
    steps: [
      "Open Claude.ai.",
      "Input prompt: 'Write a 3-paragraph post about career transitions. Keep it humble, detail a lesson learned, and avoid typical corporate jargon.'",
      "Ask Claude to: 'Add hook headings and shorten the sentences to improve reading speed.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "wed-data-analysis",
    day: "Wednesday",
    category: "data-analysis",
    categoryLabel: "Data Analysis & Visualization",
    title: "Visualize Complex Data with Julius AI",
    description: "Create advanced scatter plots, heatmaps, and clean geographical plots using conversational commands.",
    youtubeId: "rfscVS0vtbw",
    creator: "Dr. Philip Adu",
    duration: "17 mins",
    views: "36K views",
    rating: "4.7",
    toolName: "Julius AI",
    toolUrl: "https://julius.ai",
    steps: [
      "Log into Julius.ai.",
      "Upload a file containing dummy sales locations or categories.",
      "Prompt: 'Generate a color-coded heatmap showing which product categories generate the highest margin.'",
      "Save the chart image."
    ],
    difficulty: "Beginner"
  },
  {
    id: "wed-design-media",
    day: "Wednesday",
    category: "design-media",
    categoryLabel: "Design & Media Generation",
    title: "Create Cinematic Artwork in Leonardo AI",
    description: "Learn how to use Leonardo's Flow State and custom fine-tuned models to create photorealistic designs.",
    youtubeId: "FqYRkl12ON8",
    creator: "Gaurav",
    duration: "16 mins",
    views: "98K views",
    rating: "4.8",
    toolName: "Leonardo AI",
    toolUrl: "https://leonardo.ai",
    steps: [
      "Open Leonardo.ai.",
      "Select a model (e.g. Leonardo Diffusion XL) and set prompt: 'Cinematic portrait of a developer working in a futuristic workspace, warm volumetric lighting.'",
      "Apply upscale filters and download the photorealistic output."
    ],
    difficulty: "Beginner"
  },

  // ================= THURSDAY =================
  {
    id: "thu-app-web",
    day: "Thursday",
    category: "app-web",
    categoryLabel: "App & Web Development",
    title: "Build a Portfolio Site in 15 mins using Replit Agent",
    description: "Deploy an interactive HTML/JS portfolio page live to the web using Replit's conversational developer agent.",
    youtubeId: "rfscVS0vtbw",
    creator: "Jesse Showalter",
    duration: "15 mins",
    views: "210K views",
    rating: "4.8",
    toolName: "Replit",
    toolUrl: "https://replit.com",
    steps: [
      "Create a free Replit account and click 'Create Repl'.",
      "Ask Replit Agent: 'Build a dark-themed personal landing page for a writer with sections for bio, past publications, and email newsletter sign up.'",
      "Preview the app and click 'Deploy' to view the live URL."
    ],
    difficulty: "Beginner"
  },
  {
    id: "thu-agent-auto",
    day: "Thursday",
    category: "agent-auto",
    categoryLabel: "AI Agents & Automation",
    title: "Automate Daily Workflows with Gemini Gems",
    description: "Use Gemini's system prompts to set up localized assistants that act as workout planners, chefs, or study tutors.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Simpletivity",
    duration: "15 mins",
    views: "65K views",
    rating: "4.7",
    toolName: "Gemini",
    toolUrl: "https://gemini.google.com",
    steps: [
      "Log into Gemini.google.com and click 'Gems' in the manager console.",
      "Create a Gem named 'Workout Planner'. State guidelines: 'Create daily lists of exercises based on muscle group and equipment specified.'",
      "Test by prompting: 'Legs, only bodyweight and dumbbells' and check layout."
    ],
    difficulty: "Beginner"
  },
  {
    id: "thu-intel-research",
    day: "Thursday",
    category: "intel-research",
    categoryLabel: "Intelligence & Research",
    title: "NotebookLM for Meeting Transcript Summaries",
    description: "Upload long audio logs, notes, or transcripts to extract instant action items and key stakeholder metrics.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "The AI Advantage",
    duration: "16 mins",
    views: "190K views",
    rating: "4.8",
    toolName: "NotebookLM",
    toolUrl: "https://notebooklm.google",
    steps: [
      "Create a notebook in NotebookLM.",
      "Upload a copy of a text file transcript (or copy-paste meeting notes).",
      "Query: 'Extract a table of decisions made, deadlines, and who is responsible for each task.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "thu-writing-content",
    day: "Thursday",
    category: "writing-content",
    categoryLabel: "Writing & Content Creation",
    title: "Generate Blog Outlines and Scripts with ChatGPT",
    description: "Learn structured prompting to build 2,000-word blog structures and video script drafts in minutes.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Income Stream",
    duration: "15 mins",
    views: "185K views",
    rating: "4.8",
    toolName: "ChatGPT",
    toolUrl: "https://chatgpt.com",
    steps: [
      "Open ChatGPT.",
      "Prompt: 'Generate a blog outline for a article titled: Why AI is changing the landscape of marketing in 2026.'",
      "Request details: 'Draft the introduction section, ensuring a catchy opening statistic is included.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "thu-data-analysis",
    day: "Thursday",
    category: "data-analysis",
    categoryLabel: "Data Analysis & Visualization",
    title: "Clean Messy Data in Julius AI",
    description: "Remove blank cells, standardise column headers, and fix date formats conversationally.",
    youtubeId: "rfscVS0vtbw",
    creator: "Avery Smith",
    duration: "15 mins",
    views: "34K views",
    rating: "4.7",
    toolName: "Julius AI",
    toolUrl: "https://julius.ai",
    steps: [
      "Open Julius.ai.",
      "Upload a dataset containing empty spaces or duplicate rows.",
      "Prompt: 'Find all duplicate rows in this sheet and delete them, then fill empty values in the Sales column with the average margin.'",
      "Download the cleaned CSV file."
    ],
    difficulty: "Intermediate"
  },
  {
    id: "thu-design-media",
    day: "Thursday",
    category: "design-media",
    categoryLabel: "Design & Media Generation",
    title: "Generate Realistic AI Portraits",
    description: "Learn how to use Microsoft Designer to create clean vectors, professional avatars, and visual branding.",
    youtubeId: "FqYRkl12ON8",
    creator: "Creative Cloud",
    duration: "15 mins",
    views: "220K views",
    rating: "4.9",
    toolName: "Microsoft Designer",
    toolUrl: "https://designer.microsoft.com",
    steps: [
      "Open designer.microsoft.com.",
      "Select 'Image Creator' and enter prompt: 'Flat vector avatar of a professional designer wearing glasses, circular badge, slate gray background'.",
      "Style, edit layout filters, and export your brand avatar."
    ],
    difficulty: "Beginner"
  },

  // ================= FRIDAY =================
  {
    id: "fri-app-web",
    day: "Friday",
    category: "app-web",
    categoryLabel: "App & Web Development",
    title: "Design UI Components in v0 Like a Pro",
    description: "Learn how to generate modern layouts like navbar headers, card grids, and interactive sidebars in v0.",
    youtubeId: "rfscVS0vtbw",
    creator: "Delba de Oliveira",
    duration: "18 mins",
    views: "140K views",
    rating: "4.9",
    toolName: "v0.dev",
    toolUrl: "https://v0.dev",
    steps: [
      "Log into v0.dev.",
      "Enter prompt: 'A sleek, glassmorphic header navbar containing links for Home, About, and Blog, with a glowing search bar.'",
      "Revise by asking to: 'Make the search bar responsive and add a burger icon for mobile viewports.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "fri-agent-auto",
    day: "Friday",
    category: "agent-auto",
    categoryLabel: "AI Agents & Automation",
    title: "Automate Email Tasks with Claude",
    description: "Create prompts that draft replies to support tickets and classify messages based on urgency levels.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "The AI Advantage",
    duration: "15 mins",
    views: "98K views",
    rating: "4.8",
    toolName: "Claude",
    toolUrl: "https://claude.ai",
    steps: [
      "Open Claude.ai.",
      "Input instructions: 'Act as customer support. Analyze client emails, output classification (Urgent/Medium/Low), and draft a response proposing a solution.'",
      "Feed it a test input: 'I paid for next day shipping but my package is 3 days late, help!' and check output classification."
    ],
    difficulty: "Beginner"
  },
  {
    id: "fri-intel-research",
    day: "Friday",
    category: "intel-research",
    categoryLabel: "Intelligence & Research",
    title: "Deep Search with Perplexity Pro Features",
    description: "Learn how to use Perplexity's deep search loops, search spaces, and query structuring for academic review.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Simpletivity",
    duration: "18 mins",
    views: "115K views",
    rating: "4.8",
    toolName: "Perplexity AI",
    toolUrl: "https://perplexity.ai",
    steps: [
      "Go to Perplexity.ai and write prompt: 'Explain the recent changes to US app store antitrust rulings as of 2026.'",
      "Examine the detailed breakdown generated.",
      "Click on 'Co-pilot' or 'Deep Research' to prompt further queries on specific sections."
    ],
    difficulty: "Intermediate"
  },
  {
    id: "fri-writing-content",
    day: "Friday",
    category: "writing-content",
    categoryLabel: "Writing & Content Creation",
    title: "Write Professional Email Pitch Decks",
    description: "Use ChatGPT to generate high-converting email copy, newsletters, and introductory pitches for cold outreach.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Kevin Stratvert",
    duration: "15 mins",
    views: "180K views",
    rating: "4.8",
    toolName: "ChatGPT",
    toolUrl: "https://chatgpt.com",
    steps: [
      "Open ChatGPT.",
      "Prompt: 'Draft a 150-word cold outreach email to a hiring manager, highlighting expertise in managing AI transitions. Keep it polite and call-to-action focused.'",
      "Revise: 'Make it 30% shorter and format the key achievements as bullet points.'"
    ],
    difficulty: "Beginner"
  },
  {
    id: "fri-data-analysis",
    day: "Friday",
    category: "data-analysis",
    categoryLabel: "Data Analysis & Visualization",
    title: "Automate Monthly Sales Reports with Julius",
    description: "Generate tables, calculate margin metrics, and summarize raw business spreadsheets conversationally.",
    youtubeId: "rfscVS0vtbw",
    creator: "Dr. Philip Adu",
    duration: "15 mins",
    views: "22K views",
    rating: "4.7",
    toolName: "Julius AI",
    toolUrl: "https://julius.ai",
    steps: [
      "Open Julius.ai and load a spreadsheet of raw company transactions.",
      "Ask: 'What is our net margin this month, and what product category had the lowest margin?'",
      "Prompt Julius: 'Write a 3-sentence summary explanation of the margin drops suitable for an executive presentation.'"
    ],
    difficulty: "Intermediate"
  },
  {
    id: "fri-design-media",
    day: "Friday",
    category: "design-media",
    categoryLabel: "Design & Media Generation",
    title: "Create Consistent Characters in Leonardo AI",
    description: "Master consistent seed control, character reference nodes, and image prompts to build storyboards.",
    youtubeId: "FqYRkl12ON8",
    creator: "Art Tech",
    duration: "17 mins",
    views: "86K views",
    rating: "4.8",
    toolName: "Leonardo AI",
    toolUrl: "https://leonardo.ai",
    steps: [
      "Open Leonardo.ai image generator.",
      "Generate an avatar using prompt: '3D stylized cartoon character of an engineer, clean background'. Copy the Seed number.",
      "Generate a second image using the same Seed number with prompt: '3D stylized cartoon character of an engineer, now smiling and holding a wrench' to ensure design consistency."
    ],
    difficulty: "Intermediate"
  },

  // ================= SATURDAY =================
  {
    id: "sat-app-web",
    day: "Saturday",
    category: "app-web",
    categoryLabel: "App & Web Development",
    title: "Build a Full-Stack Diary App in Lovable",
    description: "Create a database-connected dashboard, set up login flows, and implement local storage in Lovable.",
    youtubeId: "rfscVS0vtbw",
    creator: "Liam Ottley",
    duration: "20 mins",
    views: "98K views",
    rating: "4.9",
    toolName: "Lovable.dev",
    toolUrl: "https://lovable.dev",
    steps: [
      "Open Lovable.dev.",
      "Prompt: 'Build a personal diary app where I can write daily logs. Store logs in local storage so they persist, and add a search box to query logs by keyword.'",
      "Create 2 test logs, search for a word, and check that the search filter operates."
    ],
    difficulty: "Intermediate"
  },
  {
    id: "sat-agent-auto",
    day: "Saturday",
    category: "agent-auto",
    categoryLabel: "AI Agents & Automation",
    title: "Build a Support Agent Bot in ChatGPT",
    description: "Use ChatGPT custom prompts and custom text files to construct a localized customer service chatbot agent.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Vince Opra",
    duration: "18 mins",
    views: "120K views",
    rating: "4.8",
    toolName: "ChatGPT",
    toolUrl: "https://chatgpt.com",
    steps: [
      "Create a custom GPT inside ChatGPT.",
      "Write instructions: 'You are custom support for Onwards App. Answer queries about resume upload, scheduling, and learning paths based on the context files.'",
      "Test in preview pane with query: 'How do I track my study streak?' and check response accuracy."
    ],
    difficulty: "Intermediate"
  },
  {
    id: "sat-intel-research",
    day: "Saturday",
    category: "intel-research",
    categoryLabel: "Intelligence & Research",
    title: "NotebookLM Deep Research with Custom Audio Overviews",
    description: "Master customizing the tone, style, and outline format of your Google NotebookLM podcast briefings.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Build Space",
    duration: "15 mins",
    views: "245K views",
    rating: "4.9",
    toolName: "NotebookLM",
    toolUrl: "https://notebooklm.google",
    steps: [
      "Open NotebookLM.",
      "Upload 3 separate research documents on a topic.",
      "Customize the Audio Overview generator by typing: 'Focus primarily on commercial risks and market statistics, keep the tone informative.'",
      "Generate and listen to your custom briefing."
    ],
    difficulty: "Beginner"
  },
  {
    id: "sat-writing-content",
    day: "Saturday",
    category: "writing-content",
    categoryLabel: "Writing & Content Creation",
    title: "Generate Marketing Copy with Claude",
    description: "Create email newsletters, copy blocks, and conversion page headings using advanced copywriting frameworks.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Copywriting Hub",
    duration: "16 mins",
    views: "62K views",
    rating: "4.8",
    toolName: "Claude",
    toolUrl: "https://claude.ai",
    steps: [
      "Open Claude.ai.",
      "Prompt: 'Draft a promotional email marketing template for a career coaching webinar. Use AIDA copywriting structure (Attention, Interest, Desire, Action).'",
      "Verify that all four components of AIDA are present and clearly labeled."
    ],
    difficulty: "Beginner"
  },
  {
    id: "sat-data-analysis",
    day: "Saturday",
    category: "data-analysis",
    categoryLabel: "Data Analysis & Visualization",
    title: "Analyze Marketing Campaign Data with Julius",
    description: "Compute conversion rates, compare CPC metrics, and outline campaign optimizations conversationally.",
    youtubeId: "rfscVS0vtbw",
    creator: "Dr. Philip Adu",
    duration: "15 mins",
    views: "18K views",
    rating: "4.7",
    toolName: "Julius AI",
    toolUrl: "https://julius.ai",
    steps: [
      "Open Julius.ai and upload a table of marketing ad stats.",
      "Query: 'Calculate the click-through rate (CTR) for each ad campaign and list the top 3 campaigns with the lowest cost per conversion.'",
      "Ask Julius to outline: '3 suggestions for optimizing the low-performing campaigns.'"
    ],
    difficulty: "Intermediate"
  },
  {
    id: "sat-design-media",
    day: "Saturday",
    category: "design-media",
    categoryLabel: "Design & Media Generation",
    title: "Generate High-Quality Vector Artwork in Microsoft Designer",
    description: "Learn how to prompt Designer to output clean vector illustrations, stickers, and company assets.",
    youtubeId: "FqYRkl12ON8",
    creator: "Creative Cloud",
    duration: "15 mins",
    views: "105K views",
    rating: "4.8",
    toolName: "Microsoft Designer",
    toolUrl: "https://designer.microsoft.com",
    steps: [
      "Open designer.microsoft.com.",
      "Prompt: 'A clean isometric vector design showing a computer server cabinet with glowing green lights, flat design style, white background.'",
      "Edit, apply border filters, and download your final logo asset."
    ],
    difficulty: "Beginner"
  },

  // ================= SUNDAY =================
  {
    id: "sun-app-web",
    day: "Sunday",
    category: "app-web",
    categoryLabel: "App & Web Development",
    title: "Build a Classic Retro Game in 15 Minutes",
    description: "Build an interactive, play-against-AI game (like Tic-Tac-Toe or Pong) in Lovable or v0 in minutes.",
    youtubeId: "rfscVS0vtbw",
    creator: "Delba de Oliveira",
    duration: "15 mins",
    views: "340K views",
    rating: "4.9",
    toolName: "Lovable.dev",
    toolUrl: "https://lovable.dev",
    steps: [
      "Open Lovable.dev.",
      "Prompt: 'Build a classic Snake game with a green canvas layout. Keep track of current score and high score. Use arrow buttons on the UI for mobile playability.'",
      "Play the game in the interactive preview panel and test the score counting."
    ],
    difficulty: "Beginner"
  },
  {
    id: "sun-agent-auto",
    day: "Sunday",
    category: "agent-auto",
    categoryLabel: "AI Agents & Automation",
    title: "Build a Personal Meal Planner GPT",
    description: "Configure a custom GPT assistant that takes kitchen ingredients and outputs custom 20-minute recipe plans.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Vince Opra",
    duration: "15 mins",
    views: "88K views",
    rating: "4.8",
    toolName: "ChatGPT",
    toolUrl: "https://chatgpt.com",
    steps: [
      "Navigate to Custom GPT builder inside ChatGPT.",
      "Configure guidelines: 'You are Chef Buddy. Ask users for ingredients they have, then generate 3 healthy 20-minute recipes and suggest nutritional values.'",
      "Verify with test input: 'spinach, eggs, tomatoes' and examine recipes."
    ],
    difficulty: "Beginner"
  },
  {
    id: "sun-intel-research",
    day: "Sunday",
    category: "intel-research",
    categoryLabel: "Intelligence & Research",
    title: "Compare Search Outputs: Perplexity vs ChatGPT Search vs Gemini",
    description: "Learn structural techniques to benchmark model hallucinations and compare accuracy levels across engines.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "Simpletivity",
    duration: "18 mins",
    views: "145K views",
    rating: "4.8",
    toolName: "Perplexity AI",
    toolUrl: "https://perplexity.ai",
    steps: [
      "Choose a complex current news topic.",
      "Submit the query to Perplexity, Gemini, and ChatGPT: 'Explain the current status of the global maritime shipping rate agreements.'",
      "Compare the answers for speed, formatting, and citation credibility."
    ],
    difficulty: "Beginner"
  },
  {
    id: "sun-writing-content",
    day: "Sunday",
    category: "writing-content",
    categoryLabel: "Writing & Content Creation",
    title: "Write Engaging YouTube Video Scripts with Claude",
    description: "Learn structured templates to generate 10-minute video scripts, including screen prompts and hooks.",
    youtubeId: "LR6Rzcy7wiA",
    creator: "The AI Advantage",
    duration: "15 mins",
    views: "110K views",
    rating: "4.8",
    toolName: "Claude",
    toolUrl: "https://claude.ai",
    steps: [
      "Open Claude.ai.",
      "Prompt: 'Generate a script layout for a video titled: How to build websites with no code. Include visual screen cues and a compelling intro hook.'",
      "Review the intro hook and ask Claude to make it 20% punchier."
    ],
    difficulty: "Beginner"
  },
  {
    id: "sun-data-analysis",
    day: "Sunday",
    category: "data-analysis",
    categoryLabel: "Data Analysis & Visualization",
    title: "Data Analysis Benchmark: Julius vs ChatGPT",
    description: "Compare file upload limits, script execution, and visualization quality between Julius and ChatGPT.",
    youtubeId: "rfscVS0vtbw",
    creator: "Avery Smith",
    duration: "16 mins",
    views: "45K views",
    rating: "4.8",
    toolName: "Julius AI",
    toolUrl: "https://julius.ai",
    steps: [
      "Submit the same sample dataset to both Julius.ai and ChatGPT.",
      "Ask both: 'Describe the correlation between our ad spend and total signups.'",
      "Compare the quality of the generated charts and the clarity of the explanations."
    ],
    difficulty: "Intermediate"
  },
  {
    id: "sun-design-media",
    day: "Sunday",
    category: "design-media",
    categoryLabel: "Design & Media Generation",
    title: "Create Brand Style Guides in Canva",
    description: "Use Canva Magic Studio to establish corporate brand kits, generate logos, and sync design colors.",
    youtubeId: "FqYRkl12ON8",
    creator: "Design Academy",
    duration: "15 mins",
    views: "130K views",
    rating: "4.8",
    toolName: "Canva Magic Studio",
    toolUrl: "https://canva.com",
    steps: [
      "Log into Canva.com and open a Brand Kit template.",
      "Use AI color palette suggestions to establish a primary, secondary, and background set.",
      "Apply the palette styles across a sample social media post template and download."
    ],
    difficulty: "Beginner"
  }
];

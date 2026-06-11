"use server";

export interface CalendarEvent {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  timeSlot: string; // e.g. "07:00-09:00"
  category: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface ProfileData {
  archetype: string;
  details: string;
  busyBlocks: string[]; // e.g. ["Monday-07:00-09:00", "Tuesday-17:00-19:00"]
  peakBlocks: string[]; // e.g. ["Monday-09:00-11:00", "Wednesday-13:00-15:00"]
  customAnswers?: {
    isWorking: string;
    hasCommitments: boolean;
    commitmentsDetails?: string;
    yearsExperience?: string;
    backBurnerTasks?: string;
  };
}

export async function generateSchedule(profile: ProfileData): Promise<CalendarEvent[]> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const timeSlots = [
    "05:00-07:00",
    "07:00-09:00",
    "09:00-11:00",
    "11:00-13:00",
    "13:00-15:00",
    "15:00-17:00",
    "17:00-19:00",
    "19:00-21:00",
    "21:00-23:00"
  ];

  if (geminiApiKey) {
    try {
      console.log("Generating 2-hour rhythm schedule with Gemini...");
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

      const prompt = `
You are an expert AI calendar architect for the Onwards transition platform.
Your task is to generate a highly customized weekly schedule (Monday to Friday, 5 days. For each day, there are 9 time slots: "05:00-07:00", "07:00-09:00", "09:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00", "17:00-19:00", "19:00-21:00", "21:00-23:00").

User Profile:
- Archetype: ${profile.archetype}
- Extra Details: ${profile.details}
- Custom Questionnaire: 
  * Work Status: ${profile.customAnswers?.isWorking || "N/A"}
  * Other Commitments: ${profile.customAnswers?.hasCommitments ? "Yes" : "No"} ${profile.customAnswers?.commitmentsDetails ? `(${profile.customAnswers.commitmentsDetails})` : ""}
  * Professional Experience: ${profile.customAnswers?.yearsExperience || "N/A"} years
  * Back-burner items to address: ${profile.customAnswers?.backBurnerTasks || "None"}
- Always Busy / Committed Slots (Unavailable): ${profile.busyBlocks.join(", ") || "None"} (DO NOT schedule active transition tasks here. For these slots, you MUST return title "Committed Time" under category "life operations" and description "Blocked for employment, caregiving, or critical personal commitments.")
- Peak Productivity Slots: ${profile.peakBlocks.join(", ") || "None"} (schedule high-value "career" focus tasks or intensive "learning" exercises here)

Rules:
1. Generate exactly 45 events (one for each combination of the 5 days and 9 timeSlots).
2. The timeSlots must be exactly one of: "05:00-07:00", "07:00-09:00", "09:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00", "17:00-19:00", "19:00-21:00", "21:00-23:00".
3. For slots listed in the "Always Busy / Committed Slots", return:
   - title: "Committed Time"
   - description: "Blocked for employment, caregiving, or critical commitments."
   - category: "life operations"
4. For slots listed in the "Peak Productivity Slots", prioritize scheduling high-value "career" tasks (e.g., "Deep-Focus Target Role Match Review", "Outreach to Tech Leads") or highly tactical "learning" tasks (e.g., "Build prompt templates in Google AI Studio").
5. For other open slots, distribute across categories:
   - "health and fitness" (e.g., "Zone 2 Cardiovascular Run", "Strength Training Routines").
   - "learning" (e.g., "Interactive Next.js Sandbox Session", "Supabase DB configurations").
   - "life operations" (e.g., "Financial admin audit", "Home maintenance tasks", "Addressing backburners").
   - "social / networking" (e.g., "Community meetups", "Networking check-ins").
   - "miscellaneous" (e.g., "Leisure breathing block", "Creative review").
6. Personalize "miscellaneous" tasks heavily based on the user profile:
   - If the user is a parent (archetype parent or kids/children/parenting details), generate: "Kids' Learning Progress Check: Review past test scores and design customized home learning exercises", "Home Exercise & Wellness: Quick home workout routine to stay active", "Kids' Summer Camp Planning: Research camp schedules, fees, and organize calendar", "Family Trust & Estate Review: Outline terms for a family trust and check asset allocation parameters", "Family Trip Planning: Plan travel logistics, investigate lodging, and check family calendar".
   - If the user has/owns a home (home, house, garden, yard, AC filters details), generate: "Home Filter & Maintenance Audit: Change refrigerator water filter and clean central AC unit filters", "Garden & Tree Maintenance: Garden maintenance and search for a local tree trimmer to clear branches", "Garage & Safety Maintenance: Test garage door sensors and replace kitchen ceiling bulbs", "Family Trust Setup Planning: Draft family estate trust documents and organize key property deeds", "Family Finance Reevaluation: Reevaluate family savings allocations, review index funds, and audit monthly home expenses".
   - For other users, generate: "Family Trust Setup Planning", "Family Finance Reevaluation", "Home Workspace Optimization", "Weekly Budget & Expenses Audit", "Career Backburner Cleanup".
7. Be highly tactical, specific, and actionable. Integrate details from the user's extra details.
7. Return ONLY valid JSON in the format of an array of objects matching the TypeScript definition:
   {
     "id": "unique-slug-string",
     "day": "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday",
     "timeSlot": "05:00-07:00" | "07:00-09:00" | "09:00-11:00" | "11:00-13:00" | "13:00-15:00" | "15:00-17:00" | "17:00-19:00" | "19:00-21:00" | "21:00-23:00",
     "category": "career" | "learning" | "health and fitness" | "life operations" | "social / networking" | "miscellaneous" | string,
     "title": "Actionable Title",
     "description": "Short explanation of tactical actions and accountability goal",
     "completed": false
   }
8. Return ONLY the JSON array. Do not include markdown code block formatting (like \`\`\`json ... \`\`\`) or conversational text.
`;

      const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        let textResponse = data.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedEvents = JSON.parse(textResponse) as CalendarEvent[];
        if (Array.isArray(parsedEvents) && parsedEvents.length === 45) {
          return parsedEvents.map((e, idx) => ({
            ...e,
            id: e.id || `ai-event-${idx}`,
            completed: false
          }));
        } else {
          console.warn("Gemini output array length is not 45:", parsedEvents.length);
        }
      } else {
        console.error("Gemini schedule generation failed:", await geminiRes.text());
      }
    } catch (e) {
      console.error("Gemini schedule parse error:", e);
    }
  }

  // Fallback Dynamic 2-hour Schedule Generator
  console.log("Generating rhythm schedule using local 2-hour template engine...");
  const days: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"> = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ];
  const events: CalendarEvent[] = [];

  const detailsText = profile.details.toLowerCase();
  
  // Custom topic extraction based on user input
  const learnTopic = detailsText.includes("next.js") || detailsText.includes("nextjs")
    ? "Next.js & React 19 Sandbox"
    : detailsText.includes("ai") || detailsText.includes("llm")
    ? "Google AI Studio & Model Prompting"
    : "Supabase Backend DB Operations";

  const fireGoal = detailsText.includes("fire") || detailsText.includes("retire")
    ? "FIRE Projection Audit & Index Modeling"
    : "Estate & Operations Logistics Audit";

  const sportTopic = detailsText.includes("tennis")
    ? "Tennis Drills & Agility Conditioning"
    : detailsText.includes("run") || detailsText.includes("marathon")
    ? "Zone 2 Endurance Training Session"
    : "Zone 2 Cardio Workout";

  days.forEach((day, dIdx) => {
    timeSlots.forEach((slot, sIdx) => {
      const blockId = `${day}-${slot}`;
      const isBusy = profile.busyBlocks.includes(blockId);
      const isPeak = profile.peakBlocks.includes(blockId);

      if (isBusy) {
        // Check if this slot was mock Google-synced (e.g. Monday 09:00-11:00, Wednesday 15:00-17:00, Friday 11:00-13:00)
        let title = "Committed Time";
        let description = "Time blocked for employment, caregiving, or critical personal commitments.";
        if (day === "Monday" && slot === "09:00-11:00") {
          title = "Google Calendar: Team Sync";
          description = "Imported meeting from Google Calendar account sync.";
        } else if (day === "Wednesday" && slot === "15:00-17:00") {
          title = "Google Calendar: Project Review";
          description = "Imported appointment from Google Calendar account sync.";
        } else if (day === "Friday" && slot === "11:00-13:00") {
          title = "Google Calendar: Personal Appointment";
          description = "Imported personal slot from Google Calendar account sync.";
        }

        events.push({
          id: `block-${dIdx}-${sIdx}`,
          day,
          timeSlot: slot,
          category: "life operations",
          title,
          description,
          completed: false
        });
      } else if (isPeak) {
        // Peak cognitive hours get high priority career matching/transitioning or learning
        if ((dIdx + sIdx) % 2 === 0) {
          events.push({
            id: `block-${dIdx}-${sIdx}`,
            day,
            timeSlot: slot,
            category: "career",
            title: `Onwards Match Review: Target Roles`,
            description: `Audit target role listings and match them against your parsed resume wins.`,
            completed: false
          });
        } else {
          events.push({
            id: `block-${dIdx}-${sIdx}`,
            day,
            timeSlot: slot,
            category: "learning",
            title: `Hands-on Project Sandbox: ${learnTopic}`,
            description: `Build out custom visual configurations in your playground workspace.`,
            completed: false
          });
        }
      } else {
        // Off-peak slots get fitness, tech briefing reading, ops audits, or backburner items
        const cycle = (dIdx + sIdx) % 5;
        const isParent = profile.archetype === "parent" || detailsText.includes("child") || detailsText.includes("kid") || detailsText.includes("parent") || detailsText.includes("son") || detailsText.includes("daughter");
        const isHome = detailsText.includes("home") || detailsText.includes("house") || detailsText.includes("garage") || detailsText.includes("kitchen") || detailsText.includes("maintenance") || detailsText.includes("property") || detailsText.includes("yard") || detailsText.includes("garden") || detailsText.includes("filter") || detailsText.includes("trimmer") || detailsText.includes("ac unit");

        if (cycle === 0) {
          events.push({
            id: `block-${dIdx}-${sIdx}`,
            day,
            timeSlot: slot,
            category: "health and fitness",
            title: sportTopic,
            description: `Physical routine to synchronize focus, reduce stress, and build core fitness.`,
            completed: false
          });
        } else if (cycle === 1) {
          let title = "Family Finance Reevaluation";
          let description = "Reevaluate family finance allocations, index funds, and monthly savings.";

          if (profile.customAnswers?.backBurnerTasks) {
            title = `Backburner Task: ${profile.customAnswers.backBurnerTasks.substring(0, 35)}`;
            description = "Address this backburner item and outline next accountability milestones.";
          } else {
            if (isParent) {
              title = "Family Trust & Estate Review";
              description = "Outline terms for a family trust and check asset allocation parameters.";
            } else if (isHome) {
              title = "Family Trust Setup Planning";
              description = "Draft family estate trust documents and organize key property deeds.";
            } else {
              title = fireGoal;
              description = "Review budget allocations, simulate retirement projections, and address backburners.";
            }
          }

          events.push({
            id: `block-${dIdx}-${sIdx}`,
            day,
            timeSlot: slot,
            category: "life operations",
            title,
            description,
            completed: false
          });
        } else if (cycle === 2) {
          events.push({
            id: `block-${dIdx}-${sIdx}`,
            day,
            timeSlot: slot,
            category: "life operations",
            title: "Time dedicated to the Pulse",
            description: "Curated list of tech newsletter articles, trending discussions, and podcasts are available in the Pulse tab.",
            completed: false
          });
        } else if (cycle === 3) {
          events.push({
            id: `block-${dIdx}-${sIdx}`,
            day,
            timeSlot: slot,
            category: "social / networking",
            title: `Community Networking Meetup`,
            description: `Connect with peers in your field or reach out to prospective mentors.`,
            completed: false
          });
        } else {
          // cycle === 4: Miscellaneous
          let title = "Unscheduled Creative Sandbox";
          let description = "Dedicated unscheduled time for reading, exploring new frameworks, or relaxation.";

          if (isParent) {
            const miscIndex = dIdx % 5;
            if (miscIndex === 0) {
              title = "Kids' Learning Progress Check";
              description = "Review kid's past test scores and design customized home learning exercises and materials.";
            } else if (miscIndex === 1) {
              title = "Home Exercise & Wellness";
              description = "Quick 20-30 minute home workout routine or yoga session to stay active.";
            } else if (miscIndex === 2) {
              title = "Kids' Summer Camp Planning";
              description = "Research local summer camp schedules, compare activity options, and map out enrollment dates.";
            } else if (miscIndex === 3) {
              title = "Family Trust & Estate Review";
              description = "Outline terms for a family trust and check asset allocation parameters.";
            } else {
              title = "Family Trip Planning";
              description = "Plan travel logistics, investigate lodging, and check family calendar dates.";
            }
          } else if (isHome) {
            const miscIndex = dIdx % 5;
            if (miscIndex === 0) {
              title = "Home Filter & Maintenance Audit";
              description = "Change refrigerator water filter and clean the central air conditioning unit filter.";
            } else if (miscIndex === 1) {
              title = "Garden & Tree Maintenance";
              description = "Audit garden beds, plan seasonal planting, and search for a local tree trimmer to clear branches.";
            } else if (miscIndex === 2) {
              title = "Garage & Safety Maintenance";
              description = "Test garage door sensors, inspect smoke detector batteries, and replace kitchen bulbs.";
            } else if (miscIndex === 3) {
              title = "Family Trust Setup Planning";
              description = "Draft family estate trust documents and organize key property deeds.";
            } else {
              title = "Family Finance Reevaluation";
              description = "Reevaluate family savings allocations, review index funds, and audit monthly home expenses.";
            }
          } else {
            const miscIndex = dIdx % 5;
            if (miscIndex === 0) {
              title = "Family Trust Setup Planning";
              description = "Draft estate trust outlines, document key personal assets, and review estate guidelines.";
            } else if (miscIndex === 1) {
              title = "Family Finance Reevaluation";
              description = "Reevaluate family finance allocations, review index fund holdings, and audit monthly savings.";
            } else if (miscIndex === 2) {
              title = "Home Workspace Optimization";
              description = "Organize files, clean desktop clutter, label storage boxes, and verify safety devices.";
            } else if (miscIndex === 3) {
              title = "Weekly Budget & Expenses Audit";
              description = "Review recent discretionary expenditures and verify upcoming bill payment schedules.";
            } else {
              title = "Career Backburner Cleanup";
              description = "Organize web bookmarks, delete old draft docs, and archive completed transition files.";
            }
          }

          events.push({
            id: `block-${dIdx}-${sIdx}`,
            day,
            timeSlot: slot,
            category: "miscellaneous",
            title,
            description,
            completed: false
          });
        }
      }
    });
  });

  return events;
}


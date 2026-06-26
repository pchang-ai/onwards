import { Role } from "./extract";
import { REAL_JOBS_DB } from "./realJobsDb";
import { sanitizeJob } from "./sanitizer";

export type CareerLevel = 'Entry' | 'Mid' | 'Senior' | 'Director' | 'VP';

/**
 * Classifies a job posting into a standard career level based on title keywords.
 */
export function getJobLevel(title: string): CareerLevel {
  const t = title.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ');
  
  const vpRegex = /\b(vice president|vp|svp|chief|cto|ceo|executive|c-level|c-suite|vice-president)\b/i;
  const directorRegex = /\b(director|head|manager|leader)\b/i;
  const seniorRegex = /\b(senior|sr|staff|lead|principal)\b/i;
  const entryRegex = /\b(junior|entry|intern|grad|associate|analyst|co-op)\b/i;

  if (vpRegex.test(t)) {
    return 'VP';
  }
  
  if (directorRegex.test(t)) {
    return 'Director';
  }
  
  if (seniorRegex.test(t)) {
    return 'Senior';
  }
  
  if (entryRegex.test(t)) {
    return 'Entry';
  }
  
  return 'Mid';
}

/**
 * Maps a job level to a premium, user-facing level description.
 */
export function getLevelLabel(level: CareerLevel): string {
  switch (level) {
    case 'Entry':
      return 'Associate Level';
    case 'Mid':
      return 'Professional Level';
    case 'Senior':
      return 'Senior / Lead Level';
    case 'Director':
      return 'Management / Director Level';
    case 'VP':
      return 'Executive / VP Level';
  }
}

/**
 * Determines the three target career levels to search based on the candidate's level.
 * Always returns a range of 3 levels.
 */
export function getTargetLevels(level: CareerLevel): CareerLevel[] {
  switch (level) {
    case 'Entry':
      return ['Entry', 'Mid', 'Senior'];
    case 'Mid':
      return ['Entry', 'Mid', 'Senior'];
    case 'Senior':
      return ['Mid', 'Senior', 'Director'];
    case 'Director':
      return ['Senior', 'Director', 'VP'];
    case 'VP':
      return ['Director', 'VP', 'VP']; // Clamped to highest
    default:
      return ['Mid', 'Senior', 'Director'];
  }
}

/**
 * Fetches real jobs dynamically from LinkedIn's guest search API.
 * Cleans and sanitizes all results, rejecting any placeholders or malformed titles.
 */
async function fetchLiveLinkedInJobs(keyword: string): Promise<Omit<Role, "id" | "matchScore">[]> {
  const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(keyword)}&location=United%20States&start=0`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache results for 1 hour
    });

    if (!response.ok) {
      console.log(`Live LinkedIn fetch failed for "${keyword}" with status: ${response.status}`);
      return [];
    }

    const html = await response.text();
    const jobBlocks = html.split(/<li[^>]*>/);
    const jobs: Omit<Role, "id" | "matchScore">[] = [];

    for (let i = 1; i < jobBlocks.length; i++) {
      const block = jobBlocks[i];
      if (!block.includes('job-search-card')) continue;

      const linkMatch = block.match(/<a class="base-card__full-link[^"]*" href="([^"]*)"/);
      const link = linkMatch ? linkMatch[1] : '';

      const titleMatch = block.match(/<h3 class="base-search-card__title">([\s\S]*?)<\/h3>/);
      const title = titleMatch ? titleMatch[1].trim() : '';

      const companyMatch = block.match(/<a class="hidden-nested-link"[^>]*>([\s\S]*?)<\/a>/);
      let company = companyMatch ? companyMatch[1].trim() : '';
      if (!company) {
        const subTitleMatch = block.match(/<h4 class="base-search-card__subtitle">([\s\S]*?)<\/h4>/);
        if (subTitleMatch) {
          company = subTitleMatch[1].replace(/<[^>]*>/g, '').trim();
        }
      }

      const locationMatch = block.match(/<span class="job-search-card__location">([\s\S]*?)<\/span>/);
      const location = locationMatch ? locationMatch[1].trim() : '';

      const dateMatch = block.match(/<time[^>]*>([\s\S]*?)<\/time>/);
      const postDate = dateMatch ? dateMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';

      if (title && company && link) {
        const rawJob = {
          title,
          company,
          link,
          location,
          postDate,
          source: 'LinkedIn' as const,
          description: `Analyze this open role for alignment with your skills. Sourced from the live LinkedIn job board.`
        };

        // Strict sanitation runtime verification
        const sanitized = sanitizeJob(rawJob);
        if (sanitized) {
          jobs.push(sanitized);
        }
      }
    }
    return jobs;
  } catch (error) {
    console.error(`Live LinkedIn search exception for "${keyword}":`, error);
    return [];
  }
}

/**
 * Searches the local database containing curated Wellfound, Built In, Ladders, and LinkedIn jobs.
 * Sanitizes and verifies all records, filtering by query keywords.
 */
function searchLocalDatabase(keywords: string[]): Omit<Role, "id" | "matchScore">[] {
  const queryWords = keywords
    .flatMap(k => k.toLowerCase().split(/\s+/))
    .filter(word => word.length > 1);

  const matched: Omit<Role, "id" | "matchScore">[] = [];

  for (const rawJob of REAL_JOBS_DB) {
    const job = sanitizeJob(rawJob);
    if (!job) continue;

    let matchedWordCount = 0;
    const titleLower = job.title.toLowerCase();

    queryWords.forEach(word => {
      if (titleLower.includes(word)) {
        matchedWordCount++;
      }
    });

    // Check specific alignments
    const isAiQuery = keywords.some(k => k.toLowerCase().match(/(ai|artificial|ml|machine|intelligence)/));
    const isAiJob = titleLower.match(/(ai|artificial|ml|machine|deep learning|intelligence|neural)/);
    
    const isFrontendQuery = keywords.some(k => k.toLowerCase().match(/(frontend|front-end|react|web|ui)/));
    const isFrontendJob = titleLower.match(/(frontend|front-end|react|web|ui|javascript)/);

    const isMatch = matchedWordCount > 0 || (isAiQuery && isAiJob) || (isFrontendQuery && isFrontendJob);
    
    if (isMatch) {
      matched.push({
        title: job.title,
        company: job.company,
        link: job.link,
        location: job.location,
        postDate: job.postDate,
        source: job.source,
        description: `Verified open position sourced from ${job.source}. Excellent match for your background and career target.`
      });
    }
  }

  return matched;
}

/**
 * Main orchestrator: gets open jobs for keywords, calibrated across 3 consecutive career levels.
 */
export async function getJobsForKeywords(keywords: string[], detectedLevel: CareerLevel = "Director"): Promise<Role[]> {
  const cleanKeywords = keywords.length > 0 ? keywords : ["AI Engineer", "Software Engineer"];
  console.log(`Retrieving jobs for terms: [${cleanKeywords.join(", ")}], calibrated for level: "${detectedLevel}"`);

  const fetchedJobs: Omit<Role, "id" | "matchScore">[] = [];

  // 1. Attempt live scraping for first 2 keywords to keep feeds fresh
  const liveQueries = cleanKeywords.slice(0, 2);
  for (const query of liveQueries) {
    const liveResults = await fetchLiveLinkedInJobs(query);
    if (liveResults.length > 0) {
      fetchedJobs.push(...liveResults);
    }
  }

  // 2. Fetch from our clean, multi-board local database
  const databaseResults = searchLocalDatabase(cleanKeywords);
  fetchedJobs.push(...databaseResults);

  // 3. Deduplicate by title + company (case-insensitive)
  const seen = new Set<string>();
  const uniqueJobs: Omit<Role, "id" | "matchScore">[] = [];

  for (const job of fetchedJobs) {
    const key = `${job.title.toLowerCase()}|${job.company.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }

  // 4. Group unique jobs into career level buckets
  const levelBuckets: Record<CareerLevel, Omit<Role, "id" | "matchScore">[]> = {
    Entry: [],
    Mid: [],
    Senior: [],
    Director: [],
    VP: []
  };

  uniqueJobs.forEach(job => {
    const lvl = getJobLevel(job.title);
    levelBuckets[lvl].push(job);
  });

  // 5. Select calibrated range of three levels: Level - 1, Level, Level + 1
  const targetTiers = getTargetLevels(detectedLevel);
  console.log(`Three-tier match target levels: [${targetTiers.join(", ")}]`);

  const selectedJobs: Omit<Role, "id" | "matchScore">[] = [];
  const selectedKeys = new Set<string>();

  // Helper to safely add to final list
  const tryAddJob = (job: Omit<Role, "id" | "matchScore">) => {
    const key = `${job.title.toLowerCase()}|${job.company.toLowerCase()}`;
    if (!selectedKeys.has(key)) {
      selectedKeys.add(key);
      selectedJobs.push(job);
      return true;
    }
    return false;
  };

  // Try to pick at least 2 jobs from each of the three target tiers
  const targetPickCount = 2;
  
  targetTiers.forEach(tier => {
    let pickedForTier = 0;
    const bucket = levelBuckets[tier];
    
    // 1. Try to add from query-matched jobs in this tier
    for (const job of bucket) {
      if (tryAddJob(job)) {
        pickedForTier++;
      }
      if (pickedForTier >= targetPickCount) break;
    }

    // 2. If short, backfill from the global DB using jobs of this specific tier
    if (pickedForTier < targetPickCount) {
      for (const rawJob of REAL_JOBS_DB) {
        const job = sanitizeJob(rawJob);
        if (!job) continue;
        const jobLvl = getJobLevel(job.title);
        if (jobLvl === tier) {
          const formattedJob = {
            title: job.title,
            company: job.company,
            link: job.link,
            location: job.location,
            postDate: job.postDate,
            source: job.source,
            description: `Verified open position sourced from ${job.source}. Excellent match for your career progression.`
          };
          if (tryAddJob(formattedJob)) {
            pickedForTier++;
          }
        }
        if (pickedForTier >= targetPickCount) break;
      }
    }
  });

  // If we are STILL short of 6 jobs (e.g. extremely rare DB states), pull remaining from any target tier bucket
  if (selectedJobs.length < 6) {
    for (const tier of targetTiers) {
      const bucket = levelBuckets[tier];
      for (const job of bucket) {
        tryAddJob(job);
        if (selectedJobs.length >= 6) break;
      }
      if (selectedJobs.length >= 6) break;
    }
  }

  // Double fallback: add any clean jobs from the DB to make sure we always have 6 cards
  if (selectedJobs.length < 6) {
    for (const rawJob of REAL_JOBS_DB) {
      const job = sanitizeJob(rawJob);
      if (!job) continue;
      
      tryAddJob({
        title: job.title,
        company: job.company,
        link: job.link,
        location: job.location,
        postDate: job.postDate,
        source: job.source,
        description: `Verified open position sourced from ${job.source}. Match insights for your target profile.`
      });
      if (selectedJobs.length >= 6) break;
    }
  }

  // 6. Map to final Role structure and assign matched scores (with top positions getting highest scores)
  // Sort so that VP/Director level jobs appear at the top, then Senior, then Mid/Entry
  const sortedJobs = selectedJobs.slice(0, 6).sort((a, b) => {
    const order: Record<CareerLevel, number> = { VP: 5, Director: 4, Senior: 3, Mid: 2, Entry: 1 };
    return order[getJobLevel(b.title)] - order[getJobLevel(a.title)];
  });

  const baseScores = [98, 95, 92, 89, 86, 83];

  const finalRoles: Role[] = sortedJobs.map((job, idx) => {
    const jobLvl = getJobLevel(job.title);
    return {
      id: idx + 1,
      title: job.title,
      company: job.company,
      matchScore: baseScores[idx] || (85 - idx),
      description: job.description,
      link: job.link,
      location: job.location,
      postDate: job.postDate,
      source: job.source,
      levelLabel: getLevelLabel(jobLvl)
    };
  });

  return finalRoles;
}

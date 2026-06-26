/**
 * Decodes common HTML entities to return clean text.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return "";
  return text
    .replace(/&amp;?/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validates if a string contains templating placeholders or corrupted text.
 */
export function isMalformed(text: string): boolean {
  if (!text) return true;
  const t = text.trim();
  
  // Check for common placeholders/templating syntax
  if (t.includes("{[") || t.includes("]}") || t.includes("${") || t.includes("}}") || t.includes("{{")) {
    return true;
  }
  
  // Check for code variables leaking into text (like content.title)
  if (t.includes("content.") || t.includes("job.") || t.includes("item.")) {
    return true;
  }

  // Check for literal string representations of system states
  const lower = t.toLowerCase();
  if (lower === "undefined" || lower === "null" || lower === "nan" || lower === "[object object]") {
    return true;
  }

  // Basic check for string length and typical character count
  if (t.length < 2) {
    return true;
  }

  return false;
}

/**
 * Verifies and sanitizes all properties of a job recommendation card.
 * Returns null if the job is invalid or malformed.
 */
export function sanitizeJob<T extends { title: string; company: string; link: string; location: string; description?: string }>(job: T): T | null {
  if (!job) return null;

  // 1. Check for malformed variables or placeholders in any text field
  if (
    isMalformed(job.title) ||
    isMalformed(job.company) ||
    isMalformed(job.location) ||
    (job.description && isMalformed(job.description))
  ) {
    console.warn("Filtering out malformed job entry:", job.title, "at", job.company);
    return null;
  }

  // 2. Validate URL structure
  if (!job.link || !job.link.startsWith("http")) {
    console.warn("Filtering out job due to invalid link URL:", job.title);
    return null;
  }

  // 3. Decode entities across all textual fields
  return {
    ...job,
    title: decodeHtmlEntities(job.title),
    company: decodeHtmlEntities(job.company),
    location: decodeHtmlEntities(job.location),
    description: job.description ? decodeHtmlEntities(job.description) : undefined,
    link: job.link.trim()
  };
}

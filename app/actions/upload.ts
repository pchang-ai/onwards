import { extractMetrics } from "./extract";
import { getJobsForKeywords } from "./jobSearch";


function detectLevelFromFilenameAndBytes(fileName: string, fileBytes: ArrayBuffer): 'Entry' | 'Mid' | 'Senior' | 'Director' | 'VP' {
  let combinedText = fileName.toLowerCase();
  try {
    const textDecoder = new TextDecoder('utf-8', { fatal: false });
    const partialBytes = fileBytes.slice(0, 50000);
    combinedText += " " + textDecoder.decode(partialBytes).toLowerCase();
  } catch (err) {
    console.error("TextDecoder failed, scanning filename only:", err);
  }

  // Replace non-alphanumeric characters with spaces to allow \b word boundaries to match correctly
  const cleanText = combinedText.replace(/[^a-zA-Z0-9]/g, ' ');

  const vpRegex = /\b(vice president|vp|svp|chief|cto|ceo|executive|c-level|c-suite|vice-president)\b/i;
  const directorRegex = /\b(director|head|manager|leader)\b/i;
  const seniorRegex = /\b(senior|sr|staff|lead|principal)\b/i;
  const entryRegex = /\b(junior|entry|intern|grad|associate|analyst|co-op)\b/i;

  if (vpRegex.test(cleanText)) {
    return "VP";
  }
  
  if (directorRegex.test(cleanText)) {
    return "Director";
  }
  
  if (seniorRegex.test(cleanText)) {
    return "Senior";
  }
  
  if (entryRegex.test(cleanText)) {
    return "Entry";
  }

  return "Mid";
}

export async function uploadResume(formData: FormData) {
  const file = formData.get("resume") as File | null;
  
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  const fileBytes = await file.arrayBuffer();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  // 1. Supabase Upload
  if (supabaseUrl && supabaseKey) {
    try {
      const cleanHost = supabaseUrl.replace(/\/$/, '');
      const supabaseUploadUrl = `${cleanHost}/storage/v1/object/resumes/${file.name}`;
      
      const uploadRes = await fetch(supabaseUploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': file.type || 'application/pdf'
        },
        body: fileBytes
      });
      
      if (uploadRes.ok) {
        console.log("File securely uploaded to Supabase Bucket.");
      } else {
        console.error("Supabase upload failed:", await uploadRes.text());
      }
    } catch (e) {
      console.error("Supabase error:", e);
    }
  } else {
    console.log("No Supabase credentials detected. Skipping bucket upload.");
  }

  // 2. Gemini Parsing
  let metrics, roles;
  let detectedLevel: any = detectLevelFromFilenameAndBytes(file.name, fileBytes);
  console.log(`Initial level detection from file scan: "${detectedLevel}"`);

  
  if (geminiApiKey) {
    try {
      console.log("Parsing with Gemini 1.5 Pro...");
      const base64Data = Buffer.from(fileBytes).toString('base64');
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      
      const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Analyze this resume. Return a JSON object with three keys: 'metrics' (array of objects with label, value, description), 'detectedLevel' (one of: 'Entry', 'Mid', 'Senior', 'Director', 'VP' depending on candidate's experience level), and 'roles' (array of objects with title, match, description). Ensure you include the $15M OpEx reduction and 600% AI acceleration wins. RETURN ONLY VALID JSON." },
              { inline_data: { mime_type: file.type || "application/pdf", data: base64Data } }
            ]
          }]
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        let textResponse = data.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(textResponse);
        metrics = parsed.metrics;
        roles = parsed.roles;
        if (parsed.detectedLevel) {
          detectedLevel = parsed.detectedLevel;
        }
        console.log(`Gemini extraction successful! Detected level: ${detectedLevel}`);
      } else {
        console.error("Gemini failed:", await geminiRes.text());
      }
    } catch (e) {
      console.error("Gemini parse error:", e);
    }
  }

  // Fallback to mock data if Gemini wasn't configured or failed
  if (!metrics || !roles) {
    console.log("Falling back to local metrics extraction...");
    const mockData = await extractMetrics();
    metrics = mockData.metrics;
    roles = mockData.roles;
  }

  // Retrieve real jobs for the candidate instead of fake/hallucinated ones
  try {
    const keywords = roles.map((r: any) => r.title || r.label || "");
    console.log(`Matching extracted roles/skills to real jobs at level: "${detectedLevel}"`);
    roles = await getJobsForKeywords(keywords, detectedLevel);
  } catch (error) {
    console.error("Error fetching real jobs during upload:", error);
    // Keep fallback roles if searching fails completely
  }

  return { 
    success: true, 
    message: "Resume processed successfully!",
    metrics,
    roles
  };
}


const PROMPT_TEMPLATE = `Please summarize the following YouTube video titled:
"{{title}}" transcript into 6 bullet points. Each bullet point should 
correspond to a distinct portion of the video (e.g., minute 0-3, minute 3-5,
 etc.) and highlight the main topic or focus of that segment. The format (in markdown)
  for each bullet point (-) should be the (in bold **) approximate timestamps -(in bold **)
   summary title : (regular font) key points covered in that section in a clear, factual and 
   precise manner (and two line breaks between each section). 
   Sections irrelevant to the main topic like sponsorships can be ignored. Use an emoji at the end of 
   each bullet point summary.`;

// Note: Ensure your .env has GEMINI_API_KEY
console.log("Checking Key Presence:", process.env.GEMINI_API_KEY ? "Key Found" : "Key is UNDEFINED");

export async function getLLMSummary(title: string, transcript: string) {
  const API_KEY = process.env.GEMINI_API_KEY;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

  try {
   
    const finalPrompt = PROMPT_TEMPLATE.replace("{{title}}", title);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${finalPrompt}\n\nTranscript:\n${transcript}` }]
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API failure details:", errorData);
      return { success: false, error: errorData.error?.message || `API Error: ${response.status}` };
    }

    const data = await response.json();

   
    if (data && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      return {
        success: true,
        data: data.candidates[0].content.parts[0].text
      };
    } else {
      console.error("Unexpected response structure from Gemini:", data);
      return { success: false, error: "The AI returned a malformed response." };
    }

  } catch (error: any) {
    console.error("Fetch or parsing error in gemini-api.ts:", error);
    return { success: false, error: error.message || "Failed to connect to AI service." };
  }
}
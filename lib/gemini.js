import { GoogleGenAI } from "@google/genai";

let client = null;

/**
 * Get or initialize the Gemini AI client
 * Uses the new @google/genai SDK with gemini-3-flash-preview model
 * @returns {Promise<{client: GoogleGenAI, modelName: string}>}
 */
export async function getGeminiModel() {
  if (client) {
    return { client, modelName: "cached" };
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  try {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    return { client, modelName: "gemini-3-flash-preview" };
  } catch (error) {
    console.error("Failed to initialize Gemini AI:", error);
    throw error;
  }
}

/**
 * Generate content using Gemini AI
 * @param {string} prompt - The prompt to send to the model
 * @param {string} modelName - Optional model name (defaults to gemini-3-flash-preview)
 * @returns {Promise<string>} The generated text
 */
export async function generateContent(prompt, modelName = "gemini-3-flash-preview") {
  const { client } = await getGeminiModel();
  
  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    
    return response.text || "";
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

// The client is initialized lazily on first use via getGeminiModel(), so it is
// never constructed during module import / build (avoids redundant setup and
// build-time work when the key is not needed).
export { client };

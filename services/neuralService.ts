import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { NeuralEngine, QuickSource, OutlineItem, ExternalKeys } from "../types";

export interface NeuralResult {
  text: string;
  thought?: string;
  keyUsed?: string;
}

// ==========================================
//  THE FIXED API KEY LOGIC
// ==========================================
// We removed the 10 broken hardcoded keys. 
// It will now ONLY use the secret key you put in GitHub.
const API_KEYS = [
    (import.meta.env.VITE_GEMINI_API_KEY || "")
].filter((key) => key !== "");

let currentKeyIndex = 0;

function isQuotaError(error: any): boolean {
    const msg = error?.message?.toLowerCase() || "";
    return msg.includes("quota") || msg.includes("rate limit") || msg.includes("429") || msg.includes("resource_exhausted") || msg.includes("limit exceeded");
}

const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = 2,
  delay: number = 2000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    if (isQuotaError(error)) throw error; 
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
};

export const callNeuralEngine = async (
  engine: NeuralEngine,
  prompt: string,
  systemInstruction: string,
  file?: QuickSource | null,
  userKeys: ExternalKeys = {}
): Promise<NeuralResult> => {
  
  // Use a valid model name (Gemini 1.5 Flash is the most reliable)
  const modelName = "gemini-1.5-flash";

    try {
        const activeKey = API_KEYS[0]; // Use your GitHub Secret key
        if (!activeKey) return { text: "Error: No API Key found. Please check GitHub Secrets." };

        const ai = new GoogleGenAI(activeKey);
        const model = ai.getGenerativeModel({ 
            model: modelName,
            systemInstruction: systemInstruction 
        });

        const parts: any[] = [{ text: prompt }];
        if (file) {
            parts.push({
                inlineData: { data: file.data, mimeType: file.mimeType }
            });
        }

        const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
        const response = await result.response;

        return {
            text: response.text(),
            thought: `Neural synthesis complete via ${modelName}.`,
            keyUsed: "GitHub Secret Key"
        };
    } catch (error: any) {
        return { 
            text: `<div class="p-6 bg-red-50 text-red-600 rounded-xl">Error: ${error.message}</div>` 
        };
    }
};

export const generateNeuralOutline = async (
  prompt: string
): Promise<OutlineItem[]> => {
    try {
      const activeKey = API_KEYS[0];
      if (!activeKey) return [];

      const ai = new GoogleGenAI(activeKey);
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      const response = await model.generateContent(prompt);
      const jsonStr = response.response.text() || "[]";
      // Clean up JSON if AI adds markdown backticks
      const cleanJson = jsonStr.replace(/```json|```/g, "");
      const data = JSON.parse(cleanJson);
      
      const addIds = (items: any[]): OutlineItem[] => {
        return items.map((item, index) => ({
          id: `outline-${Date.now()}-${index}-${Math.random()}`,
          title: item.title,
          expanded: true,
          children: item.children ? addIds(item.children) : []
        }));
      };

      return addIds(data);
    } catch (error: any) {
      console.error("Outline failed:", error.message);
      return [];
    }
};

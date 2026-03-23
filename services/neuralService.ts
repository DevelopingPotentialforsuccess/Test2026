
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { NeuralEngine, QuickSource, OutlineItem, ExternalKeys } from "../types";

export interface NeuralResult {
  text: string;
  thought?: string;
  keyUsed?: string;
}

// ==========================================
//  THE SPARE BATTERY PACK (API KEY LIST)
// ==========================================
const API_KEYS = [
    "AIzaSyAMdJJiItIVmN3zjzWqhZZX94cL8PzGJ7M",
    "AIzaSyAqaqCaDHw2LQaYIke5CJ8ctM4oevspRig",
    "AIzaSyDM0-uHXjX_LYwOLcs_j9virMFUL3eX2Xs",
    "AIzaSyApBrvFBVOGsyzTKxJ5eBts70Hy6VMslp0",
    "AIzaSyA1_8oTXES3hGSPW7KAd-yomQBMJ1Zil5c",
    "AIzaSyAwLBaYPaElWqCfC3IoG8tqwTKdY_RX_2s",
    "AIzaSyAv2gJNs2NuD1EVLJK3N9CSJuIy6RFD6ro",
    "AIzaSyCIvsS2Gz35QVbgHZU-MkeG7thKkWNXlyE",
    "AIzaSyCSI4oJLQ1s60JhGucALalwzzPgp8QE3cA",
    "AIzaSyCoc7lGtmcpGGZFiVi__rxTk52_53J08XY",
    // Use the original environment variable as the final backup
    process.env.API_KEY || ""
].filter((key, index, self) => key !== "" && self.indexOf(key) === index);

let currentKeyIndex = 0;

function isQuotaError(error: any): boolean {
    const msg = error?.message?.toLowerCase() || "";
    return msg.includes("quota") || msg.includes("rate limit") || msg.includes("429") || msg.includes("resource_exhausted") || msg.includes("limit exceeded");
}

function incrementKeyIndex() {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
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
    if (isQuotaError(error)) throw error; // Don't retry same key if it's a quota error
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
  
  if (engine === NeuralEngine.GEMINI_3_FLASH || engine === NeuralEngine.GEMINI_3_PRO) {
    let attempts = 0;
    const maxAttempts = API_KEYS.length;

    while (attempts < maxAttempts) {
      try {
        const activeKey = API_KEYS[currentKeyIndex];
        return await withRetry(async () => {
          const ai = new GoogleGenAI({ apiKey: activeKey });
          const parts: any[] = [{ text: prompt }];
          if (file) {
            parts.push({
              inlineData: { data: file.data, mimeType: file.mimeType }
            });
          }

          const response: GenerateContentResponse = await ai.models.generateContent({
            model: engine,
            contents: { parts },
            config: {
              systemInstruction,
              temperature: 0.7,
              topP: 0.95,
              topK: 64
            },
          });

          return {
            text: response.text || "No content generated.",
            thought: `Neural synthesis complete via ${engine} node. (Key index: ${currentKeyIndex})`,
            keyUsed: activeKey.substring(0, 8) + "..."
          };
        });
      } catch (error: any) {
        console.error(`Gemini call failed on key index ${currentKeyIndex}.`, error.message);
        if (isQuotaError(error)) {
          console.warn("⚠️ Quota exceeded. Switching batteries...");
          incrementKeyIndex();
          attempts++;
        } else {
          return { 
            text: `<div class="p-6 bg-red-50 text-red-600 rounded-xl">Error: ${error.message}</div>` 
          };
        }
      }
    }
    return { text: `<div class="p-6 bg-red-50 text-red-600 rounded-xl">Error: All Gemini API keys exhausted (Quota limits).</div>` };
  }

  const userKey = userKeys[engine];
  if (!userKey) return { text: `<div class="p-6 bg-orange-50 text-orange-600">Key required for ${engine}</div>` };

  return withRetry(async () => {
    let endpoint = "";
    if (engine === NeuralEngine.GPT_4O) endpoint = "https://api.openai.com/v1/chat/completions";
    else if (engine === NeuralEngine.GROK_3) endpoint = "https://api.x.ai/v1/chat/completions";
    else if (engine === NeuralEngine.DEEPSEEK_V3) endpoint = "https://api.deepseek.com/chat/completions";

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userKey}` },
      body: JSON.stringify({
        model: engine,
        messages: [{ role: "system", content: systemInstruction }, { role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    return { text: data.choices[0].message.content, thought: `External synthesis via ${engine}.` };
  }).catch((error: any) => ({ text: `<div class="p-6 bg-red-50 text-red-600">Error: ${error.message}</div>` }));
};

// Fixed initialization and property access for generateNeuralOutline.
export const generateNeuralOutline = async (
  prompt: string
): Promise<OutlineItem[]> => {
  let attempts = 0;
  const maxAttempts = API_KEYS.length + 1;

  while (attempts < maxAttempts) {
    try {
      const activeKey = API_KEYS[currentKeyIndex];
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                children: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING } } } }
                    }
                  }
                }
              },
              required: ["title"]
            }
          }
        }
      });

      // Access .text property directly.
      const jsonStr = response.text || "[]";
      const data = JSON.parse(jsonStr);
      
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
      console.error(`Outline generation failed on key index ${currentKeyIndex}.`, error.message);
      if (isQuotaError(error)) {
           console.warn("⚠️ Quota exceeded during outline. Switching batteries...");
           incrementKeyIndex();
           attempts++;
      } else {
           // Non-quota error, give up on outline.
           return [];
      }
    }
  }
  console.error("All keys exhausted for outline generation.");
  return [];
};

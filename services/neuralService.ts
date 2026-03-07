import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { NeuralEngine, QuickSource, OutlineItem, ExternalKeys } from "../types";

export interface NeuralResult {
  text: string;
  thought?: string;
  keyUsed?: string;
}

// ==========================================
// SECURE ROTATION: Pulls the 12 keys from the bridge we just built
const API_KEYS = (process.env.GEMINI_KEYS || "")
    .split(",")
    .map(key => key.trim())
    .filter(key => key.length > 0);

let currentKeyIndex = 0;

function isKeyFailure(error: any): boolean {
    const msg = error?.message?.toLowerCase() || "";
    // Switch key if: Quota full (429), Key Leaked/Disabled (403), or Invalid
    return (
        msg.includes("quota") || 
        msg.includes("rate limit") || 
        msg.includes("429") || 
        msg.includes("403") || 
        msg.includes("permission_denied") ||
        msg.includes("expired") ||
        msg.includes("limit exceeded")
    );
}

function incrementKeyIndex() {
    if (API_KEYS.length === 0) return;
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
    if (retries <= 0 || isKeyFailure(error)) throw error; 
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
    if (API_KEYS.length === 0) {
        return { text: `<div class="p-6 bg-red-50 text-red-600 rounded-xl">Error: No API keys found in environment.</div>` };
    }

    let attempts = 0;
    const maxAttempts = API_KEYS.length;

    while (attempts < maxAttempts) {
      const activeKey = API_KEYS[currentKeyIndex];
      try {
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
            thought: `Neural synthesis complete via ${engine} node. (Key #${currentKeyIndex + 1} active)`,
            keyUsed: activeKey.substring(0, 8) + "..."
          };
        });
      } catch (error: any) {
        console.warn(`Key #${currentKeyIndex} failed: ${error.message}. Switching...`);
        if (isKeyFailure(error)) {
          incrementKeyIndex();
          attempts++;
        } else {
          return { text: `<div class="p-6 bg-red-50 text-red-600 rounded-xl">System Error: ${error.message}</div>` };
        }
      }
    }
    return { text: `<div class="p-6 bg-red-50 text-red-600 rounded-xl">Error: All ${API_KEYS.length} keys are exhausted or disabled.</div>` };
  }

  // Handle other engines (GPT-4, etc)
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

export const generateNeuralOutline = async (
  prompt: string
): Promise<OutlineItem[]> => {
  if (API_KEYS.length === 0) return [];
  
  let attempts = 0;
  const maxAttempts = API_KEYS.length;

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
      if (isKeyFailure(error)) {
           incrementKeyIndex();
           attempts++;
      } else {
           return [];
      }
    }
  }
  return [];
};

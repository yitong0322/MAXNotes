import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";
import { MOCK_PRODUCTS } from "../constants";

// Initialize Gemini
// Note: In a real production app, ensure API_KEY is restricted or proxy requests through backend.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchProductsWithGemini = async (query: string): Promise<string[]> => {
  if (!query.trim()) return [];
  if (!process.env.API_KEY) {
      console.warn("No API Key provided, skipping AI search.");
      return [];
  }

  try {
    const productListString = MOCK_PRODUCTS.map(p => 
      `ID: ${p.id}, Code: ${p.code}, Name: ${p.name}, Desc: ${p.description}, Tags: ${p.tags.join(', ')}`
    ).join('\n');

    const prompt = `
      用户正在搜索学校笔记或工具。用户的搜索词是: "${query}"。
      
      请从以下产品列表中找到最相关的产品。
      如果搜索词模糊（例如"写代码的课"），请根据描述和标签进行推理（例如匹配"CS101"）。
      
      产品列表:
      ${productListString}
      
      请只返回最相关的产品ID列表。如果没有相关产品，返回空列表。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of matching product IDs"
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || '{"productIds": []}');
    return json.productIds || [];

  } catch (error) {
    console.error("Gemini search failed:", error);
    return [];
  }
};

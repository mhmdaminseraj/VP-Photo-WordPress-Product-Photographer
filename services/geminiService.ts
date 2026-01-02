
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ImageSize, ImageModel, ChatModel } from "../types";

export const generateProductImage = async (
  title: string,
  category: string,
  style: string,
  size: ImageSize,
  model: ImageModel
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Create a high-end, professional product hero image for a WordPress ${category} titled "${title}". 
  The design style should be ${style}. 
  The image should feature a sleek, modern desktop browser or a high-resolution laptop screen displaying a stunning user interface. 
  Environment: Clean studio background with soft cinematic lighting. 
  Focus: Premium aesthetics, sharp details, and professional presentation suitable for a theme marketplace like ThemeForest. 
  No text on the image except for the conceptual UI elements.`;

  const config: any = {
    imageConfig: {
      aspectRatio: "16:9",
    }
  };

  // Only Pro models support explicit size selection like 2K/4K
  if (model === 'gemini-3-pro-image-preview') {
    config.imageConfig.imageSize = size;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: config,
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("No image generated.");
    
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Could not find image data in response.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
      throw new Error("API_KEY_RESET_REQUIRED");
    }
    throw error;
  }
};

export const chatWithGemini = async (
  message: string,
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  model: ChatModel
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: model,
    history: history,
    config: {
      systemInstruction: "You are a world-class WordPress product expert and conversion copywriter. Help the user optimize their theme/plugin product titles, descriptions, and visual branding. Provide concise, professional advice.",
      thinkingConfig: model === 'gemini-3-pro-preview' ? { thinkingBudget: 4096 } : undefined
    }
  });

  return await chat.sendMessageStream({ message });
};

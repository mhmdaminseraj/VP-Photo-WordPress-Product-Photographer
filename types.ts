
export type ImageSize = '1K' | '2K' | '4K';

export type ImageModel = 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';
// Updated to use gemini-3-flash-preview for basic text tasks as per guidelines
export type ChatModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  size: ImageSize;
  model: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppView {
  PHOTOGRAPHER = 'photographer',
  CHAT = 'chat',
  GALLERY = 'gallery'
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Fixed: Added readonly modifier to match existing declarations in the environment
    readonly aistudio: AIStudio;
  }
}

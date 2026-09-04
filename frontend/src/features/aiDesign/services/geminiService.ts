import type { GeneratedDesignImage } from "../aiDesignInterface";

export async function generateDesignImage(structuredPrompt: string): Promise<GeneratedDesignImage> {
  try {

    const encodedPrompt = encodeURIComponent(structuredPrompt);
    
    
    const randomSeed = Math.floor(Math.random() * 1000000);
    
  
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&seed=${randomSeed}&nologo=true&enhance=true`;

    return { 
      mimeType: "image/jpeg", 
      dataUrl: imageUrl 
    };

  } catch (error: unknown) {
    console.error("Image Generation Error:", error);
    throw new Error("Failed to generate image.");
  }
}
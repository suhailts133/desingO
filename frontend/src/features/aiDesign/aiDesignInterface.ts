export interface AISpaceTypeOption {
  id: string;
  label: string;
}

export interface AIDesignStyleOption {
  id: string;
  label: string;
}

export interface StructuredDesignPrompt {
  structuredPrompt: string;
  matchedSpaceType: string;
  matchedDesignStyle: string;
}

export interface GeneratedDesignImage {
  dataUrl: string;
  mimeType: string;
}

export type AIDesignStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AIDesignState {
  isPanelOpen: boolean;
  status: AIDesignStatus;
  error: string | null;
  structuredPrompt: string | null;
  matchedSpaceType: string | null;
  matchedDesignStyle: string | null;
  generatedImage: GeneratedDesignImage | null;
}

export interface GenerateDesignThunkArg {
  userPrompt: string;
}

export interface GenerateDesignResult {
  structuredPrompt: string;
  matchedSpaceType: string;
  matchedDesignStyle: string;
  generatedImage: GeneratedDesignImage;
}
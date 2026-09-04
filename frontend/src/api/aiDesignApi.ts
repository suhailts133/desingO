// src/api/aiDesignApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GenerateDesignResult } from "../features/aiDesign/aiDesignInterface";
import { structurePromptWithGroq } from "../features/aiDesign/services/groqService";
import { generateDesignImage } from "../features/aiDesign/services/geminiService";

export const aiDesignApi = createApi({
  reducerPath: "aiDesignApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    generateDesign: builder.mutation<GenerateDesignResult, string>({
      async queryFn(userPrompt) {
        try {
          const structured = await structurePromptWithGroq(userPrompt);
          const generatedImage = await generateDesignImage(structured.structuredPrompt);

          return {
            data: {
              structuredPrompt: structured.structuredPrompt,
              matchedSpaceType: structured.matchedSpaceType,
              matchedDesignStyle: structured.matchedDesignStyle,
              generatedImage,
            },
          };
        } catch (error: unknown) { 
         
          const errorMessage =
            error instanceof Error ? error.message : "Failed to generate AI design";


          return {
            error: {
              status: "CUSTOM_ERROR" as const,
              error: errorMessage,
            },
          };
        }
      },
    }),
  }),
});

export const { useGenerateDesignMutation } = aiDesignApi;
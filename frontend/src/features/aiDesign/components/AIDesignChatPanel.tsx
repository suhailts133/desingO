import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { closeAIDesignPanel } from "../store/aiDesignSlice";
import { useGenerateDesignMutation } from "../../../api/aiDesignApi"; 
import type { RootState } from "../../../app/store"; 
import AIPromptInput from "./AIPromptInput";
import AIGeneratedImageResult from "./AIGeneratedImageResult";

export default function AIDesignChatPanel() {
  const [prompt, setPrompt] = useState("");
  const dispatch = useDispatch();
  
  
  const isPanelOpen = useSelector((state: RootState) => state.aiDesignUI.isPanelOpen);

  
  const [generateDesign, { data, isLoading, error }] = useGenerateDesignMutation();

  const handleClose = () => {
    dispatch(closeAIDesignPanel());
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    
   
    await generateDesign(prompt.trim());
  };

  return (
    <>
    
      {isPanelOpen && <div className="fixed inset-0 z-50 bg-black/30" onClick={handleClose} />}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="text-base font-semibold">AI Design Generator</h2>
          <button type="button" onClick={handleClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AIPromptInput value={prompt} onChange={setPrompt} disabled={isLoading} />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-black py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? "Generating..." : "Generate Design"}
          </button>

   
          {error && (
            <p className="mt-3 text-sm text-red-600">
              {typeof error === "string" ? error : "Failed to generate design."}
            </p>
          )}

     
          {data?.generatedImage && (
            <AIGeneratedImageResult
              image={data.generatedImage}
              matchedSpaceType={data.matchedSpaceType}
              matchedDesignStyle={data.matchedDesignStyle}
            />
          )}
        </div>
      </aside>
    </>
  );
}
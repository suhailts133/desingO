import { Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { openAIDesignPanel } from "../store/aiDesignSlice";

export default function AIDesignButton() {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch(openAIDesignPanel())}
      className="fixed bottom-20 right-6 z-40 flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-text-on-accent hover:bg-accent-hover active:bg-accent-active transition-all hover:scale-105"
    >
      <Sparkles size={18} />
  
    </button>
  );
}
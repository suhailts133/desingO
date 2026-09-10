import { Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { openAIDesignPanel } from "../store/aiDesignSlice";

export default function AIDesignButton() {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch(openAIDesignPanel())}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-black px-5 py-3 text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
    >
      <Sparkles size={18} />
      <span className="text-sm font-medium">AI Design</span>
    </button>
  );
}
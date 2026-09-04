// src/features/aiDesign/store/aiDesignSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AIDesignUIState {
  isPanelOpen: boolean;
}

const initialState: AIDesignUIState = {
  isPanelOpen: false,
};

const aiDesignSlice = createSlice({
  name: "aiDesignUI",
  initialState,
  reducers: {
    openAIDesignPanel(state) {
      state.isPanelOpen = true;
    },
    closeAIDesignPanel(state) {
      state.isPanelOpen = false;
    },
  },
});

export const { openAIDesignPanel, closeAIDesignPanel } = aiDesignSlice.actions;
export default aiDesignSlice.reducer;
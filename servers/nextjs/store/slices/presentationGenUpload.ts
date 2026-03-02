import { PresentationConfig, ThemeType } from "@/app/(presentation-generator)/upload/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectedTemplateInfo {
  id: string;
  isCustom: boolean;
}

interface PresentationGenUploadState {
  config: PresentationConfig | null;
  files: any;
  selectedTheme: string;
  selectedTemplate: SelectedTemplateInfo | null;
}

const initialState: PresentationGenUploadState = {
  config: null,
  files: [],
  selectedTheme: ThemeType.Light,
  selectedTemplate: null,
};

export const presentationGenUploadSlice = createSlice({
  name: "pptGenUpload",
  initialState,
  reducers: {
    setPptGenUploadState: (
      state,
      action: PayloadAction<Partial<PresentationGenUploadState>>
    ) => {
      const payload = action.payload;
      if (payload.config !== undefined) state.config = payload.config!;
      if (payload.files !== undefined) state.files = payload.files!;
    },
    setSelectedTheme: (state, action: PayloadAction<string>) => {
      state.selectedTheme = action.payload;
    },
    setSelectedTemplate: (state, action: PayloadAction<SelectedTemplateInfo | null>) => {
      state.selectedTemplate = action.payload;
    },
  },
});

export const { setPptGenUploadState, setSelectedTheme, setSelectedTemplate } =
  presentationGenUploadSlice.actions;
export default presentationGenUploadSlice.reducer;

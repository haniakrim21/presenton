"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedTemplate } from "@/store/slices/presentationGenUpload";
import { TemplateLayoutsWithSettings } from "@/app/presentation-templates/utils";
import TemplateSelection from "@/app/(presentation-generator)/outline/components/TemplateSelection";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Wrapper from "@/components/Wrapper";
import { trackEvent, MixpanelEvent } from "@/utils/mixpanel";

const TemplateSelectionPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { selectedTemplate: savedTemplate } = useSelector(
    (state: RootState) => state.pptGenUpload
  );

  // Local state to track current selection
  // For inbuilt: TemplateLayoutsWithSettings object; for custom: string (UUID)
  const [currentSelection, setCurrentSelection] = useState<
    TemplateLayoutsWithSettings | string | null
  >(() => {
    // Restore from Redux if user navigates back
    if (!savedTemplate) return null;
    if (savedTemplate.isCustom) return savedTemplate.id;
    // For inbuilt, we just store null — the TemplateSelection component
    // will visually match by ID so we pass the ID as a string sentinel.
    // We can't restore the full object here without importing templates,
    // but the component only needs the ID to show "Selected" badge.
    return null;
  });

  const handleSelectTemplate = (template: TemplateLayoutsWithSettings | string) => {
    setCurrentSelection(template);
  };

  const handleNext = () => {
    if (!currentSelection) {
      toast.error("Please select a template before proceeding.");
      return;
    }

    // Save to Redux
    if (typeof currentSelection === "string") {
      // Custom template — currentSelection is UUID
      dispatch(setSelectedTemplate({ id: currentSelection, isCustom: true }));
    } else {
      // Inbuilt template — currentSelection is TemplateLayoutsWithSettings
      dispatch(setSelectedTemplate({ id: currentSelection.id, isCustom: false }));
    }

    trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/theme" });
    router.push("/theme");
  };

  return (
    <Wrapper className="pb-10 lg:max-w-[70%] xl:max-w-[65%]">
      <div className="py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Select Template
        </h1>
        <p className="text-gray-500 text-sm">
          Choose a layout template for your presentation slides
        </p>
      </div>

      <div className="mb-8">
        <TemplateSelection
          selectedTemplate={currentSelection}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>

      <Button
        onClick={handleNext}
        className="w-full rounded-[32px] flex items-center justify-center py-6 bg-[#5141e5] text-white font-instrument_sans font-semibold text-xl hover:bg-[#5141e5]/80 transition-colors duration-300"
      >
        <span>Next</span>
        <ChevronRight className="!w-6 !h-6" />
      </Button>
    </Wrapper>
  );
};

export default TemplateSelectionPage;

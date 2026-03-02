"use client";

import React, { useMemo } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { OverlayLoader } from "@/components/ui/overlay-loader";
import Wrapper from "@/components/Wrapper";
import OutlineContent from "./OutlineContent";
import EmptyStateView from "./EmptyStateView";
import GenerateButton from "./GenerateButton";

import { useOutlineStreaming } from "../hooks/useOutlineStreaming";
import { useOutlineManagement } from "../hooks/useOutlineManagement";
import { usePresentationGeneration } from "../hooks/usePresentationGeneration";
import { TemplateLayoutsWithSettings } from "@/app/presentation-templates/utils";
import { templates } from "@/app/presentation-templates";

const OutlinePage: React.FC = () => {
  const { presentation_id, outlines } = useSelector(
    (state: RootState) => state.presentationGeneration
  );

  const { selectedTemplate: savedTemplate } = useSelector(
    (state: RootState) => state.pptGenUpload
  );

  // Resolve template from Redux-stored ID
  const resolvedTemplate: TemplateLayoutsWithSettings | string | null = useMemo(() => {
    if (!savedTemplate) return null;
    if (savedTemplate.isCustom) return savedTemplate.id; // custom: pass UUID string
    // Inbuilt: look up full object from templates array
    return templates.find((t) => t.id === savedTemplate.id) ?? null;
  }, [savedTemplate]);

  // Custom hooks
  const streamState = useOutlineStreaming(presentation_id);
  const { handleDragEnd, handleAddSlide } = useOutlineManagement(outlines);
  const { loadingState, handleSubmit } = usePresentationGeneration(
    presentation_id,
    outlines,
    resolvedTemplate
  );

  if (!presentation_id) {
    return <EmptyStateView />;
  }

  return (
    <div className="h-[calc(100vh-72px)]">
      <OverlayLoader
        show={loadingState.isLoading}
        text={loadingState.message}
        showProgress={loadingState.showProgress}
        duration={loadingState.duration}
      />

      <Wrapper className="h-full flex flex-col w-full">
        <div className="flex-grow overflow-y-hidden w-[1200px] mx-auto">
          <div className="h-full flex flex-col">
            <div className="my-4">
              <h1 className="text-2xl font-semibold text-gray-900">Outline & Content</h1>
            </div>

            <div className="flex-grow w-full mx-auto h-[calc(100vh-16rem)] overflow-y-auto custom_scrollbar">
              <OutlineContent
                outlines={outlines}
                isLoading={streamState.isLoading}
                isStreaming={streamState.isStreaming}
                activeSlideIndex={streamState.activeSlideIndex}
                highestActiveIndex={streamState.highestActiveIndex}
                onDragEnd={handleDragEnd}
                onAddSlide={handleAddSlide}
              />
            </div>
          </div>
        </div>

        {/* Fixed Button */}
        <div className="py-4 border-t border-gray-200">
          <div className="max-w-[1200px] mx-auto">
            <GenerateButton
              outlineCount={outlines.length}
              loadingState={loadingState}
              streamState={streamState}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default OutlinePage;

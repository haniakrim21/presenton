"use client";

import React, { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedTheme } from "@/store/slices/presentationGenUpload";
import {
  clearOutlines,
  setPresentationId,
} from "@/store/slices/presentationGeneration";
import {
  ALL_THEMES,
  THEME_CATEGORIES,
  THEMES_BY_CATEGORY,
  ThemeCategory,
  ThemeColors,
} from "../theme-data";
import { PresentationGenerationApi } from "../../services/api/presentation-generation";
import { OverlayLoader } from "@/components/ui/overlay-loader";
import { Button } from "@/components/ui/button";
import { ChevronRight, Check, Search } from "lucide-react";
import { toast } from "sonner";
import Wrapper from "@/components/Wrapper";
import { trackEvent, MixpanelEvent } from "@/utils/mixpanel";

function ThemeCard({
  themeId,
  displayName,
  colors,
  isSelected,
  onClick,
}: {
  themeId: string;
  displayName: string;
  colors: ThemeColors;
  isSelected: boolean;
  onClick: () => void;
}) {
  const bg = colors["--background-color"];
  const card = colors["--card-color"];
  const primary = colors["--primary-color"];
  const text = colors["--primary-text"];
  const subtext = colors["--background-text"];
  const stroke = colors["--stroke"];

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 p-4 transition-all duration-200 text-left ${
        isSelected
          ? "border-[#5141e5] shadow-lg ring-2 ring-[#5141e5]/20"
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#5141e5] flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Mini preview */}
      <div
        className="rounded-lg overflow-hidden border mb-3"
        style={{ backgroundColor: bg, borderColor: stroke }}
      >
        {/* Title bar */}
        <div className="px-3 pt-3 pb-2">
          <div
            className="h-2.5 w-24 rounded-full mb-1.5"
            style={{ backgroundColor: primary }}
          />
          <div
            className="h-1.5 w-32 rounded-full"
            style={{ backgroundColor: subtext, opacity: 0.5 }}
          />
        </div>

        {/* Content area */}
        <div className="px-3 pb-3 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 rounded-md p-2"
              style={{ backgroundColor: card, border: `1px solid ${stroke}` }}
            >
              <div
                className="h-1.5 w-full rounded-full mb-1"
                style={{ backgroundColor: text, opacity: 0.3 }}
              />
              <div
                className="h-1 w-3/4 rounded-full"
                style={{ backgroundColor: subtext, opacity: 0.3 }}
              />
            </div>
          ))}
        </div>
      </div>

      <p className="font-medium text-sm text-gray-800">{displayName}</p>
    </button>
  );
}

const ThemeSelectionPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { config, files, selectedTheme } = useSelector(
    (state: RootState) => state.pptGenUpload
  );

  const [currentTheme, setCurrentTheme] = useState<string>(
    selectedTheme || "light"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ThemeCategory | "All">(
    "All"
  );

  const [loading, setLoading] = useState({
    isLoading: false,
    message: "",
    duration: 30,
    showProgress: false,
  });

  const filteredThemes = useMemo(() => {
    let themes =
      activeCategory === "All"
        ? ALL_THEMES
        : THEMES_BY_CATEGORY[activeCategory] || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      themes = themes.filter((t) =>
        t.displayName.toLowerCase().includes(q)
      );
    }
    return themes;
  }, [activeCategory, searchQuery]);

  const handleThemeSelect = (themeId: string) => {
    setCurrentTheme(themeId);
  };

  const handleGenerateOutline = async () => {
    dispatch(setSelectedTheme(currentTheme));

    if (!config) {
      toast.error("Configuration missing. Please go back and try again.");
      return;
    }

    try {
      setLoading({
        isLoading: true,
        message: "Generating outlines...",
        showProgress: true,
        duration: 30,
      });

      const documentPaths: string[] = [];
      if (files && Array.isArray(files) && files.length > 0) {
        const flatFiles = files.flat().filter((f: any) => f && f.file_path);
        flatFiles.forEach((f: any) => documentPaths.push(f.file_path));
      }

      trackEvent(MixpanelEvent.Upload_Create_Presentation_API_Call);
      const createResponse =
        await PresentationGenerationApi.createPresentation({
          content: config.prompt ?? "",
          n_slides: config.slides ? parseInt(config.slides) : null,
          file_paths: documentPaths,
          kb_document_ids: config.kbDocumentIds?.length
            ? config.kbDocumentIds
            : undefined,
          language: config.language ?? "",
          tone: config.tone,
          verbosity: config.verbosity,
          instructions: config.instructions || null,
          include_table_of_contents: !!config.includeTableOfContents,
          include_title_slide: !!config.includeTitleSlide,
          web_search: !!config.webSearch,
          export_as: config.exportFormat ?? "pptx",
          slides_markdown: config.slidesMarkdown
            ? config.slidesMarkdown.split(/\n---\n/).map((s) => s.trim()).filter(Boolean)
            : null,
        });

      dispatch(setPresentationId(createResponse.id));
      dispatch(clearOutlines());
      trackEvent(MixpanelEvent.Navigation, {
        from: pathname,
        to: "/outline",
      });
      router.push("/outline");
    } catch (error: any) {
      console.error("Error creating presentation:", error);
      setLoading({
        isLoading: false,
        message: "",
        duration: 0,
        showProgress: false,
      });
      toast.error("Error", {
        description: error.message || "Failed to create presentation.",
      });
    }
  };

  return (
    <Wrapper className="pb-10 lg:max-w-[70%] xl:max-w-[65%]">
      <OverlayLoader
        show={loading.isLoading}
        text={loading.message}
        showProgress={loading.showProgress}
        duration={loading.duration}
      />

      <div className="py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Select Theme
        </h1>
        <p className="text-gray-500 text-sm">
          Choose a color theme for your presentation
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search themes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5141e5] focus:ring-1 focus:ring-[#5141e5]/30"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("All")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            activeCategory === "All"
              ? "bg-[#5141e5] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {THEME_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-[#5141e5] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Theme grid */}
      {filteredThemes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {filteredThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              themeId={theme.id}
              displayName={theme.displayName}
              colors={theme.colors}
              isSelected={currentTheme === theme.id}
              onClick={() => handleThemeSelect(theme.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 mb-8">
          <p className="text-gray-400 text-sm">No themes found</p>
        </div>
      )}

      <Button
        onClick={handleGenerateOutline}
        className="w-full rounded-[32px] flex items-center justify-center py-6 bg-[#5141e5] text-white font-instrument_sans font-semibold text-xl hover:bg-[#5141e5]/80 transition-colors duration-300"
      >
        <span>Generate Outline</span>
        <ChevronRight className="!w-6 !h-6" />
      </Button>
    </Wrapper>
  );
};

export default ThemeSelectionPage;

"use client";

import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedTheme } from "@/store/slices/presentationGenUpload";
import {
  ALL_THEMES,
  THEME_CATEGORIES,
  THEMES_BY_CATEGORY,
  ThemeCategory,
} from "../../theme/theme-data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Palette, Check, Search } from "lucide-react";
import ToolTip from "@/components/ToolTip";
import { ScrollArea } from "@/components/ui/scroll-area";

const ThemePicker = () => {
  const dispatch = useDispatch();
  const selectedTheme = useSelector(
    (state: RootState) => state.pptGenUpload.selectedTheme
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    ThemeCategory | "All"
  >("All");
  const [open, setOpen] = useState(false);

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

  const handleThemeChange = (themeId: string) => {
    dispatch(setSelectedTheme(themeId));
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchQuery("");
      setActiveCategory("All");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <ToolTip content="Change Theme">
        <PopoverTrigger asChild>
          <button className="text-white hover:opacity-80 transition-opacity">
            <Palette className="w-6 h-6" />
          </button>
        </PopoverTrigger>
      </ToolTip>
      <PopoverContent align="end" className="w-[320px] p-3">
        <p className="text-sm font-medium text-gray-700 mb-2">Theme</p>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-xs focus:outline-none focus:border-[#5141e5] focus:ring-1 focus:ring-[#5141e5]/30"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === "All"
                ? "bg-[#5141e5] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {THEME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-[#5141e5] text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Theme grid */}
        <ScrollArea className="max-h-[280px]">
          {filteredThemes.length > 0 ? (
            <div className="grid grid-cols-4 gap-1.5">
              {filteredThemes.map((theme) => {
                const colors = theme.colors;
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`relative rounded-lg border p-1.5 transition-all duration-150 ${
                      isSelected
                        ? "border-[#5141e5] ring-1 ring-[#5141e5]/30"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#5141e5] flex items-center justify-center z-10">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                    {/* Mini color swatch */}
                    <div
                      className="rounded-md overflow-hidden h-10"
                      style={{
                        backgroundColor: colors["--background-color"],
                      }}
                    >
                      <div className="flex h-full">
                        <div className="w-1/3 flex flex-col justify-center pl-1 gap-0.5">
                          <div
                            className="h-1 w-full rounded-full"
                            style={{
                              backgroundColor: colors["--primary-color"],
                            }}
                          />
                          <div
                            className="h-0.5 w-3/4 rounded-full"
                            style={{
                              backgroundColor: colors["--background-text"],
                              opacity: 0.5,
                            }}
                          />
                        </div>
                        <div className="flex-1 flex gap-0.5 p-0.5 items-end">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-sm"
                              style={{
                                backgroundColor: colors["--card-color"],
                                height: `${40 + i * 20}%`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-center mt-1 text-gray-600 truncate">
                      {theme.displayName}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-400 text-xs">
              No themes found
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default ThemePicker;

"use client";

import Wrapper from "@/components/Wrapper";
import React from "react";
import Link from "next/link";
import BackBtn from "@/components/BackBtn";
import { usePathname } from "next/navigation";
import { Layout, FilePlus2, BookOpen, LayoutDashboard, Settings } from "lucide-react";
import { trackEvent, MixpanelEvent } from "@/utils/mixpanel";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const Header = () => {
  const pathname = usePathname();
  const canChangeKeys = useSelector((state: RootState) => state.userConfig.can_change_keys);
  return (
    <div className="bg-[#5146E5] w-full shadow-lg sticky top-0 z-50">
      <Wrapper>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-3">
            {(pathname !== "/upload" && pathname !== "/dashboard") && <BackBtn />}
            <Link href="/dashboard" onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/dashboard" })}>
              <img
                src="/nabds-logo-white.svg"
                alt="NAbds AI"
                className="h-10"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              prefetch={false}
              onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/dashboard" })}
              className="flex items-center gap-2 px-3 py-2 text-white hover:bg-primary/80 rounded-md transition-colors outline-none"
              role="menuitem"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium font-inter">Dashboard</span>
            </Link>
            <Link
              href="/custom-template"
              prefetch={false}
              onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/custom-template" })}
              className="flex items-center gap-2 px-3 py-2 text-white hover:bg-primary/80 rounded-md transition-colors outline-none"
              role="menuitem"
            >
              <FilePlus2 className="w-5 h-5" />
              <span className="text-sm font-medium font-inter">Create Template</span>
            </Link>
            <Link
              href="/template-preview"
              prefetch={false}
              onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/template-preview" })}
              className="flex items-center gap-2 px-3 py-2 text-white hover:bg-primary/80 rounded-md transition-colors outline-none"
              role="menuitem"
            >
              <Layout className="w-5 h-5" />
              <span className="text-sm font-medium font-inter">Templates</span>
            </Link>
            <Link
              href="/knowledge-base"
              prefetch={false}
              onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/knowledge-base" })}
              className="flex items-center gap-2 px-3 py-2 text-white hover:bg-primary/80 rounded-md transition-colors outline-none"
              role="menuitem"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium font-inter">Knowledge Base</span>
            </Link>
            {canChangeKeys && (
              <Link
                href="/settings"
                prefetch={false}
                onClick={() => trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/settings" })}
                className="flex items-center gap-2 px-3 py-2 text-white hover:bg-primary/80 rounded-md transition-colors outline-none"
                role="menuitem"
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium font-inter">Settings</span>
              </Link>
            )}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default Header;

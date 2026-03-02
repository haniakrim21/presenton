import React from "react";
import Header from "@/app/(presentation-generator)/dashboard/components/Header";
import { Metadata } from "next";
import ThemeSelectionPage from "./components/ThemeSelectionPage";

export const metadata: Metadata = {
  title: "Select Theme",
  description: "Choose a theme for your presentation.",
};

const page = () => {
  return (
    <div className="relative min-h-screen">
      <Header />
      <ThemeSelectionPage />
    </div>
  );
};

export default page;

import React from "react";
import Header from "@/app/(presentation-generator)/dashboard/components/Header";
import { Metadata } from "next";
import TemplateSelectionPage from "./components/TemplateSelectionPage";

export const metadata: Metadata = {
  title: "Select Template",
  description: "Choose a template for your presentation.",
};

const page = () => {
  return (
    <div className="relative min-h-screen">
      <Header />
      <TemplateSelectionPage />
    </div>
  );
};

export default page;

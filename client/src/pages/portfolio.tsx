import React from "react";
import { Navigation } from "@/components/navigation";
import { Portfolio } from "@/components/portfolio";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Portfolio />
      </div>
    </div>
  );
}
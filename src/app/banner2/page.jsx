import TopLegalExpertsList from "./TopLegalExpertsList";
import { Trophy } from "lucide-react";

export default function TopLegalExperts() {
  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-10 text-center animate-[fadeSlideDown_0.8s_easeOut]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy size={24} className="text-amber-500" />
          <h2 className="text-3xl font-bold text-foreground">
            Top Legal Experts
          </h2>
        </div>
        <p className="text-default-500 text-sm mt-1">
          Most hired lawyers on our platform
        </p>
      </div>

      <TopLegalExpertsList />
    </div>
  );
}

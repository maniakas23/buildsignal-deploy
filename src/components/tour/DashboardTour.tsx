import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

interface TourStep {
  target: string; // CSS selector for the element to highlight
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: ".dashboard-header",
    title: "Welcome to Your Dashboard",
    description: "This is your command center. All your markets, opportunities, and alerts in one place.",
    position: "bottom",
  },
  {
    target: ".stats-row",
    title: "At-a-Glance Metrics",
    description: "Track total opportunities, active alerts, markets monitored, and pipeline value in real time.",
    position: "bottom",
  },
  {
    target: ".opportunity-trend-chart",
    title: "Opportunity Trends",
    description: "Visualize how permit activity is changing over time. Spot surges before your competitors do.",
    position: "top",
  },
  {
    target: ".market-breakdown-chart",
    title: "Market Breakdown",
    description: "See which sectors are driving the most activity in your tracked markets.",
    position: "top",
  },
  {
    target: ".recent-opportunities",
    title: "Recent Opportunities",
    description: "AI-scored projects ranked by confidence. Higher scores mean stronger signals.",
    position: "top",
  },
  {
    target: ".alert-summary",
    title: "Alert Summary",
    description: "Critical notifications about new permits, zoning changes, and market shifts.",
    position: "left",
  },
  {
    target: ".quick-actions",
    title: "Quick Actions",
    description: "Export reports, manage alerts, or add opportunities to your watchlist with one click.",
    position: "top",
  },
];

export function DashboardTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // Only show tour if user has completed onboarding AND hasn't seen the tour
    const onboardingDone = localStorage.getItem("buildsignal_onboarding_complete");
    const tourSeen = localStorage.getItem("buildsignal_tour_seen");
    if (onboardingDone && !tourSeen) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const positionTooltip = useCallback(() => {
    const step = tourSteps[currentStep];
    const el = document.querySelector(step.target);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 140;
    let top = 0, left = 0;

    switch (step.position) {
      case "bottom":
        top = rect.bottom + 12;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "top":
        top = rect.top - tooltipHeight - 12;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - 12;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + 12;
        break;
    }
    // Clamp to viewport
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipHeight - 8));
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));
    setTooltipPos({ top, left });
  }, [currentStep]);

  useEffect(() => {
    if (isVisible) {
      positionTooltip();
      window.addEventListener("resize", positionTooltip);
      return () => window.removeEventListener("resize", positionTooltip);
    }
  }, [isVisible, currentStep, positionTooltip]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    localStorage.setItem("buildsignal_tour_seen", "skipped");
    setIsVisible(false);
  };

  const handleComplete = () => {
    localStorage.setItem("buildsignal_tour_seen", "completed");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  // Highlight overlay with spotlight effect
  const highlightEl = document.querySelector(step.target);
  const highlightRect = highlightEl?.getBoundingClientRect();

  return (
    <div className="fixed inset-0 z-[100]" style={{ pointerEvents: "none" }}>
      {/* Dark overlay with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "auto" }}>
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {highlightRect && (
              <rect
                x={highlightRect.left - 4}
                y={highlightRect.top - 4}
                width={highlightRect.width + 8}
                height={highlightRect.height + 8}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.6)"
          mask="url(#spotlight-mask)"
          onClick={handleSkip}
        />
      </svg>

      {/* Tooltip */}
      <div
        className="absolute z-[101] w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5"
        style={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          pointerEvents: "auto",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#1F5EFF]" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Step {currentStep + 1} of {tourSteps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 mb-4">
          <div
            className="bg-[#1F5EFF] h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          {step.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          {step.description}
        </p>

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-xs"
          >
            <ChevronLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs text-slate-500">
              Skip
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              className="text-xs bg-[#1F5EFF] hover:bg-[#1F5EFF]/90 text-white"
            >
              {currentStep === tourSteps.length - 1 ? "Finish" : "Next"}
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

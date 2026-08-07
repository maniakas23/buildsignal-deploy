import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  X,
  BookOpen,
  Mail,
  Activity,
  MessageSquare,
  ChevronRight,
  Search,
  ExternalLink,
  Clock,
  ArrowRight,
} from "lucide-react";

interface HelpArticle {
  title: string;
  href: string;
}

const articles: HelpArticle[] = [
  { title: "How do confidence scores work?", href: "/help#confidence-scores" },
  { title: "Setting up your first watchlist", href: "/help#watchlist-setup" },
  { title: "Understanding permit data sources", href: "/help#permit-data" },
  { title: "API authentication guide", href: "/help#api-auth" },
  { title: "Billing and subscription FAQ", href: "/help#billing" },
  { title: "Data export and reporting", href: "/help#data-export" },
];

export function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setSearchQuery("");
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out z-40"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`
          fixed z-50 transition-all duration-300 ease-out
          ${isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
          }
          bottom-4 right-4 left-4 sm:left-auto sm:w-[380px] sm:max-h-[500px]
          max-h-[80vh] rounded-t-2xl sm:rounded-xl
          bg-[#111820] border border-[rgba(255,255,255,0.06)] shadow-2xl
          flex flex-col overflow-hidden
        `}
        style={{
          boxShadow: isOpen
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
            : "none",
        }}
        role="dialog"
        aria-label="Help and Support"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#14B8A6]" />
            <h2 className="text-base font-semibold text-[#F7FAFC]">
              Help & Support
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mr-2 text-[rgba(247,250,252,0.4)] hover:text-[#F7FAFC] hover:bg-[rgba(255,255,255,0.06)]"
            onClick={handleClose}
            aria-label="Close help drawer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {/* Search */}
          <div className="px-5 pt-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgba(247,250,252,0.4)]" />
              <Input
                ref={searchInputRef}
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.06)] text-[#F7FAFC] placeholder:text-[rgba(247,250,252,0.4)] focus-visible:ring-[#6366F1]"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="px-5 py-3">
            <div className="grid grid-cols-3 gap-2">
              <a
                href="/help"
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[#1A2430] transition-colors group"
              >
                <BookOpen className="h-5 w-5 text-[#6366F1] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium text-[#F7FAFC] text-center leading-tight">
                  Docs
                </span>
              </a>
              <a
                href="mailto:support@buildsignal.net"
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[rgba(255,255,255,0.06)] hover:bg-[#1A2430] transition-colors group"
              >
                <Mail className="h-5 w-5 text-[#F59E0B] group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-medium text-[#F7FAFC] text-center leading-tight">
                  Email
                </span>
              </a>
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-[rgba(255,255,255,0.06)]">
                <Activity className="h-5 w-5 text-[#84CC16]" />
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#84CC16] animate-pulse" />
                  <span className="text-[11px] font-medium text-[#84CC16]">
                    Up
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[rgba(255,255,255,0.06)] mx-5" />

          {/* Popular Articles */}
          <div className="px-5 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[rgba(247,250,252,0.4)] mb-2">
              Popular Articles
            </h3>
            <div className="space-y-0.5">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <a
                    key={article.href}
                    href={article.href}
                    className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-md hover:bg-[rgba(255,255,255,0.06)] transition-colors group"
                  >
                    <span className="text-sm text-[rgba(247,250,252,0.7)] group-hover:text-[#F7FAFC]">
                      {article.title}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[rgba(247,250,252,0.4)] group-hover:text-[#F7FAFC] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </a>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-[rgba(247,250,252,0.4)]">
                    No articles found for "{searchQuery}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[rgba(255,255,252,0.06)] mx-5" />

          {/* Live Chat Section */}
          <div className="px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[rgba(255,255,255,0.06)] flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-[#14B8A6]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#F7FAFC] mb-1">
                  Live Chat
                </h3>
                <p className="text-xs text-[rgba(247,250,252,0.7)] leading-relaxed mb-3">
                  Live chat is coming soon. For now, email us and we typically
                  respond within{" "}
                  <span className="text-[#14B8A6] font-medium">4 hours</span>.
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-3.5 w-3.5 text-[rgba(247,250,252,0.4)]" />
                  <span className="text-[11px] text-[rgba(247,250,252,0.4)]">
                    Avg. response time: 4 hours
                  </span>
                </div>
                <a href="mailto:support@buildsignal.net">
                  <Button
                    size="sm"
                    className="w-full h-9 bg-[#0B1F33] hover:bg-[#0B1F33]/80 text-[#F7FAFC] border border-[rgba(255,255,255,0.06)]"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                    <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-[rgba(255,255,255,0.06)] flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[rgba(247,250,252,0.4)] font-medium tracking-wide">
              BUILDSIGNAL v1.2.0
            </span>
            <a
              href="/help"
              className="flex items-center gap-1 text-[10px] text-[rgba(247,250,252,0.4)] hover:text-[#14B8A6] transition-colors"
            >
              View all help
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        className={`
          relative rounded-full h-14 w-14 flex items-center justify-center
          transition-all duration-300 ease-out shadow-lg hover:shadow-xl
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1117]
          ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 hover:scale-110"}
        `}
        style={{ backgroundColor: "#0B1F33" }}
        aria-label={isOpen ? "Close help" : "Open help"}
        aria-expanded={isOpen}
      >
        <HelpCircle className="h-6 w-6 text-white" />
      </button>
    </div>
  );
}

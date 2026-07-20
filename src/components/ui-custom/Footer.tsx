import { Signal, Cpu, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-ink-wash bg-surface/50 mt-8">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-accent-indigo" />
            <span className="text-[13px] font-semibold text-ink-primary">BuildSignal</span>
          </div>

          {/* Center: Powered by Kestovar */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-indigo/5 border border-accent-indigo/10">
            <Cpu className="w-3.5 h-3.5 text-accent-indigo" />
            <span className="text-[11px] font-medium text-accent-indigo">Powered by Kestovar</span>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-4 text-[11px] text-ink-tertiary">
            <span>&copy; {new Date().getFullYear()}</span>
            <a href="/privacy" className="hover:text-ink-primary transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-ink-primary transition-colors">Terms</a>
            <a
              href="https://docs.buildsignal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 hover:text-ink-primary transition-colors"
            >
              Docs <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { type ReactNode } from 'react';

/** Skip navigation link for accessibility */
export function SkipNavLink({ children = 'Skip to content' }: { children?: ReactNode }) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-indigo focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
    >
      {children}
    </a>
  );
}

/** Main content wrapper — the skip link target */
export function MainContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <main id="main-content" className={className} tabIndex={-1}>
      {children}
    </main>
  );
}

/** Legacy default export (no-op, kept for compatibility) */
export default function SkipNav() {
  return null;
}

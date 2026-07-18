import type { SVGProps } from 'react';

export function TowerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <rect x="9" y="3" width="6" height="3" rx="1" />
      <rect x="8" y="6" width="8" height="2" rx="0.5" />
      <rect x="9" y="8" width="6" height="2" rx="0.5" />
      <rect x="8" y="10" width="8" height="2" rx="0.5" />
      <rect x="9" y="12" width="6" height="2" rx="0.5" />
      <rect x="8" y="14" width="8" height="2" rx="0.5" />
      <rect x="9" y="16" width="6" height="2" rx="0.5" />
      <rect x="7" y="18" width="10" height="3" rx="1" />
      <circle cx="12" cy="1.5" r="1.5" opacity="0.6" />
      <path d="M9 1.5 Q12 -0.5 15 1.5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export function WaveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M2 16 Q8 8, 16 16 T30 16" />
    </svg>
  );
}

export function ExpandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M12 4 L12 10 L6 10 M20 4 L20 10 L26 10 M12 28 L12 22 L6 22 M20 28 L20 22 L26 22" />
    </svg>
  );
}

export function BoltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
      <path d="M18 2 L8 18 H14 L12 30 L24 14 H16 Z" />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
    </svg>
  );
}

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M8 1.5 A4.5 4.5 0 0 1 12.5 6 V9 L14 12 H2 L3.5 9 V6 A4.5 4.5 0 0 1 8 1.5Z" />
      <path d="M6 13.5 Q8 15.5 10 13.5" />
    </svg>
  );
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7 V11 M8 5 V5.1" strokeLinecap="round" />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11 L14 14" />
    </svg>
  );
}

export function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1 V3.5 M8 12.5 V15 M1 8 H3.5 M12.5 8 H15 M3.05 3.05 L4.8 4.8 M11.2 11.2 L12.95 12.95 M3.05 12.95 L4.8 11.2 M11.2 4.8 L12.95 3.05" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M4 4 L12 12 M12 4 L4 12" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M4 6 L8 10 L12 6" />
    </svg>
  );
}

export function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M2 3 H14 M4 8 H12 M6 13 H10" />
    </svg>
  );
}

export function MapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M1 3 L5 1 L11 4 L15 2 V13 L11 15 L5 12 L1 14 Z" />
      <path d="M5 1 V12 M11 4 V15" />
    </svg>
  );
}

export function ListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M2 4 H4 M2 8 H4 M2 12 H4 M6 4 H14 M6 8 H14 M6 12 H14" />
    </svg>
  );
}

export function CopyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="4" y="4" width="9" height="9" rx="1" />
      <path d="M12 12 V13 Q12 14 11 14 H3 Q2 14 2 13 V5 Q2 4 3 4 H4" />
    </svg>
  );
}

export function ExportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M8 2 V10 M5 5 L8 2 L11 5" />
      <path d="M2 10 V13 Q2 14 3 14 H13 Q14 14 14 13 V10" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 8 L6.5 11.5 L13 4.5" />
    </svg>
  );
}

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M8 1 L10 5.5 L15 6 L11.5 9.5 L12.5 14.5 L8 12 L3.5 14.5 L4.5 9.5 L1 6 L6 5.5 Z" />
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 4.5 V8 L10.5 10" />
    </svg>
  );
}

export function SignalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M2 10 Q4 6 8 6 Q12 6 14 10" />
      <path d="M4 12 Q6 9 8 9 Q10 9 12 12" opacity="0.6" />
      <circle cx="8" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

export function TrendUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M2 12 L6 8 L9 10 L14 4" />
      <path d="M10 4 H14 V8" />
    </svg>
  );
}

export function TrendDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M2 4 L6 8 L9 6 L14 12" />
      <path d="M10 12 H14 V8" />
    </svg>
  );
}

export function ArchiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M2 4 H14 V14 H2 Z" />
      <path d="M2 4 L14 4" strokeWidth="2" />
      <path d="M6 8 H10" />
    </svg>
  );
}

export function ArrowUpDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M4 10 L8 14 L12 10" />
      <path d="M4 6 L8 2 L12 6" />
    </svg>
  );
}

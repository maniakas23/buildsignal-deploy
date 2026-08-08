export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  isDark: boolean;
  colors: {
    // Background layers
    canvas: string;        // app/page background
    surface: string;       // card/panel background
    surfaceHover: string;  // card hover state
    elevated: string;      // modal/dropdown background
    
    // Brand colors
    primary: string;       // Deep Navy equivalent
    action: string;        // Signal Blue equivalent (CTAs, buttons)
    intelligence: string;    // Insight Teal equivalent (success, confidence)
    opportunity: string;   // Opportunity Amber equivalent (alerts, highlights)
    
    // Text
    textPrimary: string;   // main text
    textSecondary: string; // muted/secondary text
    textTertiary: string;  // hints, disabled
    textInverse: string;   // text on dark backgrounds
    
    // Status
    success: string;
    warning: string;
    error: string;
    info: string;
    
    // Borders & dividers
    border: string;
    divider: string;
    
    // Chart colors (5 distinct colors for data viz)
    chart1: string;
    chart2: string;
    chart3: string;
    chart4: string;
    chart5: string;
  };
}

export type PaletteId = 
  | "buildsignal"    // Official BuildSignal (default)
  | "kesto"          // Kestovar corporate
  | "night"          // Dark mode (current dark)
  | "ocean"          // Blue-forward
  | "forest"         // Green-forward
  | "ember"          // Warm/red-forward
  | "minimal"        // Black & white
  | "pastel"         // Soft pastel
  | "contrast"       // High contrast accessibility
  | "slate"          // All gray professional
  ;

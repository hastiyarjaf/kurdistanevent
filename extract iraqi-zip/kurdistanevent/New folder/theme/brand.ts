// Iraqi Legal Directory Brand Colors and Theme
// Based on Iraqi flag colors and legal profession aesthetics

export const BRAND_COLORS = {
  // Primary Colors (Iraqi Flag inspired)
  primary: {
    red: '#CE1126',      // Iraqi flag red - primary brand color
    white: '#FFFFFF',    // Iraqi flag white - clean, professional
    green: '#007A3D',    // Iraqi flag green - trust, growth
    black: '#000000',    // Iraqi flag black (implied) - authority, elegance
  },
  
  // Secondary Colors
  secondary: {
    gold: '#D4AF37',     // Mesopotamian gold - heritage, wisdom
    bronze: '#CD7F32',   // Ancient bronze - tradition, stability
    deepBlue: '#1B365D', // Professional navy - trust, reliability
    cream: '#F8F6F0',    // Warm neutral - approachable, clean
  },
  
  // Semantic Colors
  semantic: {
    success: '#10B981',  // Green for positive actions
    warning: '#F59E0B',  // Amber for warnings
    error: '#EF4444',    // Red for errors
    info: '#3B82F6',     // Blue for information
  },
  
  // Gray Scale
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Functional Colors
  surface: {
    background: '#FAFAFA',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Text Colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#007A3D',
    linkHover: '#005A2D',
  },
  
  // Interactive Elements
  interactive: {
    primary: '#CE1126',
    primaryHover: '#B10E21',
    primaryActive: '#9A0C1C',
    secondary: '#007A3D',
    secondaryHover: '#005A2D',
    secondaryActive: '#004122',
  }
};

// Typography Scale
export const TYPOGRAPHY = {
  fonts: {
    primary: '"Inter", "Roboto", "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    arabic: '"Vazirmatn", "Noto Sans Arabic", "Cairo", sans-serif',
    kurdish: '"Vazirmatn", "Noto Sans Kurdish", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Monaco", "Consolas", monospace',
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  }
};

// Spacing Scale (based on 8px grid)
export const SPACING = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  32: '8rem',      // 128px
};

// Border Radius
export const RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// Shadows
export const SHADOWS = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
};

// Animation Durations
export const ANIMATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
};

// Breakpoints
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Component-specific themes
export const COMPONENTS = {
  button: {
    primary: {
      background: BRAND_COLORS.primary.red,
      backgroundHover: BRAND_COLORS.interactive.primaryHover,
      color: BRAND_COLORS.primary.white,
      border: BRAND_COLORS.primary.red,
    },
    secondary: {
      background: BRAND_COLORS.primary.green,
      backgroundHover: BRAND_COLORS.interactive.secondaryHover,
      color: BRAND_COLORS.primary.white,
      border: BRAND_COLORS.primary.green,
    },
    outline: {
      background: 'transparent',
      backgroundHover: BRAND_COLORS.neutral[50],
      color: BRAND_COLORS.text.primary,
      border: BRAND_COLORS.neutral[300],
    },
  },
  
  card: {
    background: BRAND_COLORS.surface.card,
    border: BRAND_COLORS.neutral[200],
    shadow: SHADOWS.sm,
    borderRadius: RADIUS.lg,
  },
  
  input: {
    background: BRAND_COLORS.primary.white,
    border: BRAND_COLORS.neutral[300],
    borderFocus: BRAND_COLORS.primary.green,
    text: BRAND_COLORS.text.primary,
    placeholder: BRAND_COLORS.text.tertiary,
  },
};

// CSS Custom Properties for dynamic theming
export const CSS_VARIABLES = `
  :root {
    --color-primary-red: ${BRAND_COLORS.primary.red};
    --color-primary-white: ${BRAND_COLORS.primary.white};
    --color-primary-green: ${BRAND_COLORS.primary.green};
    --color-secondary-gold: ${BRAND_COLORS.secondary.gold};
    --color-text-primary: ${BRAND_COLORS.text.primary};
    --color-text-secondary: ${BRAND_COLORS.text.secondary};
    --font-primary: ${TYPOGRAPHY.fonts.primary};
    --font-arabic: ${TYPOGRAPHY.fonts.arabic};
    --font-kurdish: ${TYPOGRAPHY.fonts.kurdish};
    --spacing-base: ${SPACING[4]};
    --radius-base: ${RADIUS.base};
    --shadow-base: ${SHADOWS.base};
  }
`;

export default {
  BRAND_COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  ANIMATION,
  BREAKPOINTS,
  COMPONENTS,
  CSS_VARIABLES,
};

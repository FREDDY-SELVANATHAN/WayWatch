/**
 * Light Theme - WAY WATCH Smart City Dashboard
 * Clean surfaces, soft contrast, and restrained dark accents.
 */

export const colors = {
  // Primary colors
  primary: "#111827",
  primaryLight: "#374151",
  primaryDark: "#030712",

  // Secondary colors
  secondary: "#1F2937",
  accent: "#6B7280",

  // Severity colors
  critical: "#E11D48",
  critical_light: "#FB7185",
  medium: "#D97706",
  medium_light: "#FBBF24",
  low: "#16A34A",
  low_light: "#86EFAC",

  // Backgrounds
  bg_primary: "#F8FAFC",
  bg_secondary: "#EEF2F7",
  bg_tertiary: "#E2E8F0",
  bg_surface: "rgba(255, 255, 255, 0.82)",
  bg_overlay: "rgba(248, 250, 252, 0.9)",

  // Glass effect backgrounds
  glass_light: "rgba(255, 255, 255, 0.92)",
  glass_medium: "rgba(255, 255, 255, 0.84)",
  glass_dark: "rgba(241, 245, 249, 0.72)",

  // Text colors
  text_primary: "#0F172A",
  text_secondary: "#334155",
  text_tertiary: "#64748B",
  text_muted: "#94A3B8",
  text_dark: "#1E293B",

  // Status colors
  success: "#16A34A",
  warning: "#D97706",
  error: "#E11D48",
  info: "#0EA5E9",

  // Borders
  border_light: "rgba(15, 23, 42, 0.08)",
  border_medium: "rgba(15, 23, 42, 0.12)",
  border_dark: "rgba(15, 23, 42, 0.18)",

  // Gradients
  gradient_primary: {
    start: "#111827",
    end: "#6B7280",
  },
  gradient_dark: {
    start: "#E5E7EB",
    end: "#CBD5E1",
  },
  gradient_danger: {
    start: "#E11D48",
    end: "#FB7185",
  },

  // Transparency
  transparent: "transparent",
};

export const shadows = {
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    elevation: 6,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    elevation: 8,
  },
  glow_cyan: {
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    elevation: 6,
  },
  glow_danger: {
    shadowColor: "#E11D48",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    elevation: 6,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  body_lg: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  body_md: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
  body_sm: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  caption: {
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 14,
  },
  button: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
};

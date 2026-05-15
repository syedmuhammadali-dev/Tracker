export const COLORS = {
  primary: '#00A86B', // Pakistan Green variant
  secondary: '#2E3D49',
  accent: '#FFD700', // Gold for SOS/Alerts
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  error: '#FF4D4D',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  border: '#EEEEEE',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
};

export const FONTS = {
  h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700', lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '600', lineHeight: 26 },
  body1: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  body2: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  body3: { fontSize: 12, fontWeight: '400', lineHeight: 18 },
  caption: { fontSize: 10, fontWeight: '400', lineHeight: 14 },
};

const theme = { COLORS, SPACING, SIZES, FONTS };

export default theme;

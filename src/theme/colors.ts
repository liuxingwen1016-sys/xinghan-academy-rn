export type AppColors = {
  primary: string;
  primaryDark: string;
  accent: string;
  warning: string;
  success: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  overlay: string;
  white: string;
};

export const lightColors: AppColors = {
  primary: '#0969E8',
  primaryDark: '#052A61',
  accent: '#08B8D4',
  warning: '#FFAA2B',
  success: '#15A66F',
  background: '#F6F8FB',
  surface: '#FFFFFF',
  surfaceMuted: '#EDF3FA',
  text: '#0A1E3C',
  textMuted: '#6E7D93',
  border: '#DFE6EF',
  overlay: 'rgba(7, 31, 68, 0.58)',
  white: '#FFFFFF',
};

export const darkColors: AppColors = {
  primary: '#58A1FF',
  primaryDark: '#061D3D',
  accent: '#34D4E7',
  warning: '#FFB84D',
  success: '#43D59C',
  background: '#071426',
  surface: '#10223A',
  surfaceMuted: '#152B48',
  text: '#F2F7FF',
  textMuted: '#A8B8CD',
  border: '#263C58',
  overlay: 'rgba(0, 0, 0, 0.72)',
  white: '#FFFFFF',
};

export const spacing = {xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32};
export const radius = {sm: 8, md: 12, lg: 18, pill: 999};

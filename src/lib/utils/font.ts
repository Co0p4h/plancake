export const fontSizes = {
  'xs': '12px',
  'sm': '14px', 
  'base': '16px',
  'lg': '18px',
  'xl': '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '36px',
  '5xl': '48px',
} as const;

export function fontSize(token: keyof typeof fontSizes): string {
  return fontSizes[token];
}
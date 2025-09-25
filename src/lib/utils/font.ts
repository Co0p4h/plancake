import type { FontSize, TypographyTheme } from "$lib/server/db/schema";

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

type ElementFontSizeOptions = {
  [K in keyof TypographyTheme]: Array<FontSize>;
};

export const elementFontSizeOptions: ElementFontSizeOptions = {
  header_title: ['xl', '2xl', '3xl', '4xl', '5xl'],
  header_description: ['xs', 'sm', 'base', 'lg', 'xl'],
  date_range: ['xs', 'sm'],
  day_numbers: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'],
  day_labels: ['xs', 'sm', 'base', 'lg', 'xl'],
  item_title: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'],
  item_description: ['xs', 'sm', 'base', 'lg'],
  item_time: ['xs', 'sm', 'base', 'lg', 'xl', '2xl'],
  empty_text: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'],
  artist_text: ['xs', 'sm', 'base', 'lg', 'xl', '2xl'],
};
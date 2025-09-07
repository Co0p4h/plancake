export const localeToLanguage = (locale: string) => {
  switch (locale) {
    case 'en':
      return 'English';
    case 'ja':
      return '日本語';
    default:
      return 'English';
  }
}
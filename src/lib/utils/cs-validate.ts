
export function validateImageUrl(url: string) {
  if (!url) return "please enter an image url";
  try {
    const urlObj = new URL(url);
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const pathname = urlObj.pathname.toLowerCase();
    const hasValidExtension = validImageExtensions.some(ext => pathname.endsWith(ext));
    
    if (!hasValidExtension) {
      return "please enter a valid image url\n";
    }
    
    return "";
  } catch {
    return "please enter a valid url\n";
  }
};

export function validateArtistUrl(url: string) {
  if (!url) return "please enter an artist url\n";
  try {
    const urlObj = new URL(url);
    const isHttp = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    if (!isHttp) {
      return "please enter a valid artist url\n";
    }
    return "";
  } catch {
    return "please enter a valid artist url\n";
  }
};

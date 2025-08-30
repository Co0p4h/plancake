
export function validateImageUrl(url: string) {
  if (!url) return "please enter an image url";
  try {
    const urlObj = new URL(url);
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const pathname = urlObj.pathname.toLowerCase();
    const hasValidExtension = validImageExtensions.some(ext => pathname.endsWith(ext));
    
    if (!hasValidExtension) {
      return "please enter a valid image url";
    }
    
    return "";
  } catch {
    return "please enter a valid url";
  }
};

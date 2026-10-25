/**
 * Safely resolves an image URL.
 * If the incoming URL is already absolute (e.g. Supabase CDN https://...),
 * it is returned directly without alteration or prepending.
 * Otherwise, relative paths are prefixed with the backend API URL.
 */
export const getImageUrl = (url?: string | null): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  const backendUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'https://nauvaaya.onrender.com';
  return `${backendUrl.replace(/\/$/, '')}/${trimmed.replace(/^\//, '')}`;
};


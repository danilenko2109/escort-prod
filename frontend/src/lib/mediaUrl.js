const API_URL = String(process.env.REACT_APP_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : ''))
  .trim()
  .replace(/\/$/, '');

/**
 * Resolves profile image src for <img>: absolute URLs pass through;
 * paths like /uploads/... are prefixed with API origin.
 */
export function resolveMediaUrl(src) {
  if (!src || typeof src !== 'string') return '';
  const t = src.trim();
  if (!t) return '';
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  if (t.startsWith('/')) return `${API_URL}${t}`;
  return t;
}

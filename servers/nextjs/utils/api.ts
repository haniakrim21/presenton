// Utility to get the FastAPI base URL
export function getFastAPIUrl(): string {
  // In Electron environment, use the exposed env variable
  if (typeof window !== 'undefined' && (window as any).env) {
    return (window as any).env.NEXT_PUBLIC_FAST_API || '';
  }
  // Fallback for development
  return process.env.NEXT_PUBLIC_FAST_API || 'http://127.0.0.1:8000';
}

// Utility to construct full API URL
export function getApiUrl(path: string): string {
  const baseUrl = getFastAPIUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
}

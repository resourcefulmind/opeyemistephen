export const READ_KEY = 'press-read-slugs';
export const SERIES_KEY = 'press-series-last';

export function loadReadState(): { read: Set<string>; seriesLast: Record<string, string> } {
  try {
    return {
      read: new Set(JSON.parse(localStorage.getItem(READ_KEY) ?? '[]')),
      seriesLast: JSON.parse(localStorage.getItem(SERIES_KEY) ?? '{}'),
    };
  } catch {
    return { read: new Set(), seriesLast: {} };
  }
}

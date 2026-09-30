/**
 * Reading state, stored only in this browser. Nothing leaves the device.
 *
 * progress:   highest share of each article's body the reader has scrolled past (0 to 100)
 * seriesLast: the part of each series the reader opened most recently
 */
export const PROGRESS_KEY = 'press-progress';
export const SERIES_KEY = 'press-series-last';

/** An article counts as read once this much of its body has been scrolled past. */
export const READ_THRESHOLD = 90;

export interface ReadState {
  progress: Record<string, number>;
  seriesLast: Record<string, string>;
}

export function loadReadState(): ReadState {
  try {
    return {
      progress: JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}'),
      seriesLast: JSON.parse(localStorage.getItem(SERIES_KEY) ?? '{}'),
    };
  } catch {
    return { progress: {}, seriesLast: {} };
  }
}

export function isRead(state: ReadState, slug: string): boolean {
  return (state.progress[slug] ?? 0) >= READ_THRESHOLD;
}

/** The element holding the article text (the header, cover and end matter are not counted). */
export function articleBody(): HTMLElement | null {
  return document.querySelector<HTMLElement>('.article-body');
}

/**
 * Share of the article text the reader has reached, 0 to 100: how much of the body
 * has passed the bottom of the viewport. The progress bar and the saved reading
 * position both use this, so they always agree.
 */
export function bodyProgress(body: HTMLElement): number {
  const rect = body.getBoundingClientRect();
  if (rect.height <= 0) return 0;
  const seen = (window.innerHeight - rect.top) / rect.height;
  return Math.max(0, Math.min(100, Math.round(seen * 100)));
}

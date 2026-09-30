export function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const TYPE_LABEL: Record<string, string> = {
  analysis: 'Analysis',
  'case-study': 'Case study',
  explainer: 'Explainer',
  tutorial: 'Tutorial',
  note: 'Note',
};

export const TYPE_PLURAL: Record<string, string> = {
  analysis: 'More analysis',
  'case-study': 'More case studies',
  explainer: 'More explainers',
  tutorial: 'More tutorials',
  note: 'More notes',
};

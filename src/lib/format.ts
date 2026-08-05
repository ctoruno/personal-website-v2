/** "Nov 2022" — the only date format the design uses. */
export function monthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/** "2023—2024" (or "2023") for a series' span, from its parts' dates. */
export function yearSpan(dates: Date[]): string {
  const years = dates.map((d) => d.getFullYear());
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}—${max}`;
}

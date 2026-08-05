import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

/** Computes reading time at build from the rendered body (handoff §5). */
export function remarkReadingTime() {
  return (tree, { data }) => {
    const readingTime = getReadingTime(toString(tree));
    data.astro.frontmatter.minutesRead = Math.max(1, Math.round(readingTime.minutes));
  };
}

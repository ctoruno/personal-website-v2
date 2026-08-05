/**
 * Components available inside every MDX body without per-post imports:
 * pass to <Content components={mdxComponents} /> (handoff §4).
 * Heading, link, blockquote and code styling comes from the .prose CSS
 * in global.css rather than element swaps.
 */
import Figure from './Figure.astro';
import YouTube from './YouTube.astro';

export const mdxComponents = {
  Figure,
  YouTube,
};

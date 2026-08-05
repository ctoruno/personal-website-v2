import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Blog posts live in src/content/blog/<slug>/index.mdx, nested one or two
 * levels deep (series keep their folder, preserving every Hugo URL — §6).
 * The id drops the trailing /index and is lowercased, because Hugo
 * lowercased its URLs and the old links must keep resolving.
 */
const blog = defineCollection({
  loader: glob({
    base: './src/content/blog',
    pattern: '**/index.{md,mdx}',
    generateId: ({ entry }) =>
      entry.replace(/\/index\.(md|mdx)$/, '').toLowerCase(),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** The line under the h1 on the post page (Hugo's `subtitle`). */
      standfirst: z.string().optional(),
      /** The list excerpt and meta description (Hugo's `excerpt`). */
      summary: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      /** Exactly one topic shows in the meta line (§5). */
      topic: z.string(),
      draft: z.boolean().default(false),
      /** Series membership is explicit — never parsed from folder names (§6). */
      series: z.string().optional(),
      part: z.number().int().positive().optional(),
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '*.{md,mdx}',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Enum, not free text — drives the accent label on 2d and 3b. */
      kicker: z.enum(['Dashboard', 'Publication', 'Open source']),
      standfirst: z.string(),
      summary: z.string(),
      role: z.string(),
      years: z.coerce.string(),
      stack: z.array(z.string()),
      client: z.string(),
      liveUrl: z.string().url().optional(),
      repoUrl: z.string().url().optional(),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .default([]),
      order: z.number().default(99),
      featured: z.boolean().default(false),
    }),
});

export const collections = { blog, projects };

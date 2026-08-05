import { z } from 'astro:content';
import type { ImageMetadata } from 'astro';
import raw from './publications.json';

/**
 * Publications have no body text, so they live in JSON rather than a
 * content collection (handoff §5) — but a typo still fails the build.
 */
const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
  primary: z.boolean().optional(),
  external: z.boolean().optional(),
});

/** The enum drives both the row kicker and the filter chips. */
const publicationSchema = z.object({
  slug: z.string(),
  title: z.string(),
  authors: z.string(),
  venue: z.string(),
  year: z.number().int(),
  type: z.enum(['report', 'note', 'thesis', 'chapter']),
  description: z.string().default(''),
  /** Filename under src/assets/publication_covers/, e.g. "../assets/publication_covers/rol-2025.jpg". */
  cover: z.string().optional(),
  links: linkSchema
    .array()
    .min(1)
    .refine((links) => links.filter((l) => l.primary).length === 1, {
      message: 'Exactly one link must be primary',
    }),
});

export type Publication = z.infer<typeof publicationSchema> & {
  coverImage?: ImageMetadata;
};

/** Chip labels per type; a fifth enum value adds a chip automatically. */
export const typeLabels: Record<Publication['type'], string> = {
  report: 'Reports',
  note: 'Notes',
  thesis: 'Theses',
  chapter: 'Chapters',
};

const covers = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/publication_covers/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

/** Sorted by year descending, then array order within a year (§5). */
export const publications: Publication[] = z
  .array(publicationSchema)
  .parse(raw)
  .map((entry, index) => ({ entry, index }))
  .sort((a, b) => b.entry.year - a.entry.year || a.index - b.index)
  .map(({ entry }) => {
    const coverImage = entry.cover ? covers[entry.cover]?.default : undefined;
    if (entry.cover && !coverImage) {
      throw new Error(`publications.json: cover not found: ${entry.cover}`);
    }
    return { ...entry, coverImage };
  });

/** The types that actually occur, in enum order — feeds the chips. */
export const activeTypes = (
  Object.keys(typeLabels) as Publication['type'][]
).filter((t) => publications.some((p) => p.type === t));

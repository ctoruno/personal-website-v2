/** Site-wide facts. `author` lives here, not in frontmatter (§5). */
export const site = {
  title: 'Carlos A. Toruño',
  author: 'Carlos A. Toruño P.',
  shortName: 'Carlos Toruño',
  tagline: 'In an endless cycle of learning and panicking.',
  description:
    'A development economist from Nicaragua who wandered into the paths of data science and never quite found the exit. This is a small glimpse of my everyday life as a data analyst — political economy reflections one week, data wrangling notes the next. Relax, pour yourself a mojito, stay a while.',
  email: 'carlos.toruno@gmail.com',
  github: 'https://github.com/ctoruno',
  linkedin: 'https://www.linkedin.com/in/carlostoruno/',
  /** Still needed (§10): the real X handle. */
  x: '#',
  location: 'Nicaragua',
  blog: {
    title: 'A Gallo Pinto Blog',
    standfirst:
      'Rice and beans — a mix of different and sometimes opposite things. Random walk in action.',
  },
} as const;

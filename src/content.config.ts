import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sharedFields = ({ image }: { image: any }) => ({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date().optional(),
  date: z.coerce.date().optional(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  heroImage: z.optional(image()),
});

const withDateAlias = <T extends z.ZodRawShape>(shape: T) =>
  z
    .object(shape)
    .transform((data) => ({
      ...data,
      pubDate: data.pubDate ?? data.date,
    }))
    .refine((data) => !!data.pubDate, {
      message: 'Either pubDate or date is required',
      path: ['pubDate'],
    });

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    withDateAlias({
      ...sharedFields({ image }),
      featured: z.boolean().default(false),
    }),
});

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    withDateAlias({
      ...sharedFields({ image }),
      kind: z.enum(['note', 'idea', 'snippet']).default('note'),
    }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    withDateAlias({
      ...sharedFields({ image }),
      status: z.enum(['active', 'paused', 'shipped']).default('active'),
      stack: z.array(z.string()).default([]),
      repoUrl: z.string().url().optional(),
      liveUrl: z.string().url().optional(),
    }),
});

export const collections = { blog, notes, projects };

# Maples Log

Developer blog for Maples — build logs, notes, projects, mistakes, fixes, and useful learnings.

## Stack

- Astro
- Markdown / MDX content collections
- RSS + sitemap

## Content structure

- `src/content/blog/` → long-form posts
- `src/content/notes/` → short notes and snippets
- `src/content/projects/` → project pages and field notes

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Site URL

Set `SITE_URL` when building for production so canonical URLs, sitemap, and RSS use the correct domain.

Example:

```bash
SITE_URL=https://example.com npm run build
```

#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const DEFAULT_BODY = `## What changed\n\n- \n\n## What I learned\n\n- \n\n## Next\n\n- \n`;

export function slugifyTitle(title) {
  return String(title)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '') || 'daily-log';
}

export function normalizeDate(value = new Date()) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new Error('invalid date');
    return value.toISOString().slice(0, 10);
  }
  const text = String(value).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new Error('date must be YYYY-MM-DD');
  }
  const parsed = new Date(`${text}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text) {
    throw new Error(`invalid calendar date: ${text}`);
  }
  return text;
}

export function buildPost({ date, title, description, tags = [], body = DEFAULT_BODY }) {
  const safeDate = normalizeDate(date);
  const safeTitle = String(title || '').trim();
  if (!safeTitle) throw new Error('title is required');
  const safeDescription = String(description || '').trim();
  if (!safeDescription) throw new Error('description is required');

  const tagLines = tags.length > 0
    ? ['tags:', ...tags.map((tag) => `  - ${String(tag).trim()}`)].join('\n')
    : 'tags: []';

  return `---\ntitle: ${quoteYaml(safeTitle)}\ndescription: ${quoteYaml(safeDescription)}\npubDate: ${safeDate}\n${tagLines}\n---\n\n${String(body).replace(/^\s+/, '').replace(/\s*$/, '\n')}`;
}

function quoteYaml(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function parseArgs(argv) {
  const args = { tags: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      const value = argv[++i];
      if (!value) throw new Error(`${arg} needs a value`);
      return value;
    };
    if (arg === '--date') args.date = next();
    else if (arg === '--title') args.title = next();
    else if (arg === '--description') args.description = next();
    else if (arg === '--tag') args.tags.push(next());
    else if (arg === '--body-file') args.bodyFile = next();
    else if (arg === '--out-dir') args.outDir = next();
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  return args;
}

export async function createDailyPost(options, { cwd = process.cwd() } = {}) {
  const date = normalizeDate(options.date || new Date());
  const title = String(options.title || '').trim();
  if (!title) throw new Error('--title is required');
  const slug = slugifyTitle(title);
  const outDir = path.resolve(cwd, options.outDir || 'src/content/blog');
  const filePath = path.join(outDir, `${date}-${slug}.md`);
  const body = options.bodyFile ? await readFile(path.resolve(cwd, options.bodyFile), 'utf8') : undefined;
  const content = buildPost({ ...options, date, title, body });

  await mkdir(outDir, { recursive: true });
  await writeFile(filePath, content, { flag: 'wx' });
  return { filePath, content };
}

function printHelp() {
  console.log(`Usage: node scripts/new-daily-post.mjs --title <title> --description <summary> [options]\n\nOptions:\n  --date YYYY-MM-DD        Defaults to today in UTC when omitted\n  --tag <tag>              Repeatable\n  --body-file <path>       Use body markdown from a file\n  --out-dir <path>         Defaults to src/content/blog\n`);
}

async function main(argv) {
  const args = parseArgs(argv);
  if (args.help) {
    printHelp();
    return 0;
  }
  const result = await createDailyPost(args);
  console.log(path.relative(process.cwd(), result.filePath));
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}

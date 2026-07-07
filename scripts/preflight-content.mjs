import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const DATED_BASENAME_RE = /^(?<startYear>\d{4})-(?<startMonth>\d{2})-(?<startDay>\d{2})(?:-to-(?:(?<endYear>\d{4})-)?(?<endMonth>\d{2})-(?<endDay>\d{2}))?(?:-.+)?$/;
const SUPPORTED_EXTENSIONS = new Set(['.md', '.mdx']);

export function parseFilenameDateRange(filename) {
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);
  const match = basename.match(DATED_BASENAME_RE);
  if (!match?.groups) {
    return null;
  }

  const startDate = `${match.groups.startYear}-${match.groups.startMonth}-${match.groups.startDay}`;
  const endYear = match.groups.endYear || match.groups.startYear;
  const endDate = match.groups.endMonth
    ? `${endYear}-${match.groups.endMonth}-${match.groups.endDay}`
    : startDate;

  return {
    startDate,
    endDate,
    isRange: Boolean(match.groups.endMonth),
  };
}

export function extractFrontmatter(text) {
  const normalized = text.replace(/^\uFEFF/, '');
  if (!normalized.startsWith('---\n')) {
    return null;
  }

  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) {
    throw new Error('frontmatter block is not closed');
  }

  const block = normalized.slice(4, end);
  const values = {};

  for (const line of block.split('\n')) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.+?)\s*$/);
    if (!match) {
      continue;
    }
    values[match[1]] = unquoteScalar(match[2]);
  }

  return values;
}

function unquoteScalar(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function normalizeFrontmatterDate(value) {
  if (!value) {
    return null;
  }

  const match = String(value).trim().match(/^(\d{4}-\d{2}-\d{2})(?:$|[T\s].*)/);
  return match ? match[1] : null;
}

export function validateContentFile(filePath, text) {
  const expected = parseFilenameDateRange(path.basename(filePath));
  if (!expected) {
    return { filePath, checked: false, errors: [] };
  }

  const frontmatter = extractFrontmatter(text);
  if (!frontmatter) {
    return {
      filePath,
      checked: true,
      errors: ['missing frontmatter block'],
      expectedDate: expected.endDate,
    };
  }

  const dateValue = normalizeFrontmatterDate(frontmatter.date);
  const pubDateValue = normalizeFrontmatterDate(frontmatter.pubDate);
  const canonicalDate = pubDateValue || dateValue;
  const errors = [];

  if (expected.isRange && expected.endDate < expected.startDate) {
    errors.push(`filename date range ends before it starts (${expected.startDate} -> ${expected.endDate})`);
  }
  if (!canonicalDate) {
    errors.push('missing parseable date/pubDate in frontmatter');
  }
  if (dateValue && pubDateValue && dateValue !== pubDateValue) {
    errors.push(`date (${dateValue}) and pubDate (${pubDateValue}) do not match`);
  }
  if (canonicalDate && canonicalDate !== expected.endDate) {
    errors.push(`frontmatter date ${canonicalDate} does not match filename date ${expected.endDate}`);
  }

  return {
    filePath,
    checked: true,
    errors,
    expectedDate: expected.endDate,
    actualDate: canonicalDate,
    isRange: expected.isRange,
  };
}

async function collectContentFiles(inputPath) {
  const fileInfo = await stat(inputPath);
  if (fileInfo.isFile()) {
    return SUPPORTED_EXTENSIONS.has(path.extname(inputPath)) ? [inputPath] : [];
  }

  const files = [];
  for (const entry of await readdir(inputPath, { withFileTypes: true })) {
    const entryPath = path.join(inputPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectContentFiles(entryPath)));
      continue;
    }
    if (entry.isFile() && SUPPORTED_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }
  return files;
}

export async function runPreflight(targets = ['src/content'], { cwd = process.cwd() } = {}) {
  const resolvedTargets = targets.map((target) => path.resolve(cwd, target));
  const files = [];
  for (const target of resolvedTargets) {
    files.push(...(await collectContentFiles(target)));
  }

  const results = [];
  for (const filePath of files.sort()) {
    const text = await readFile(filePath, 'utf8');
    results.push(validateContentFile(filePath, text));
  }

  const checked = results.filter((result) => result.checked);
  const failed = checked.filter((result) => result.errors.length > 0);

  return {
    ok: failed.length === 0,
    checkedCount: checked.length,
    skippedCount: results.length - checked.length,
    failedCount: failed.length,
    results,
  };
}

export function formatReport(report, { cwd = process.cwd() } = {}) {
  const lines = [];
  lines.push(
    `checked ${report.checkedCount} dated content file${report.checkedCount === 1 ? '' : 's'} ` +
      `(${report.skippedCount} skipped without filename dates)`
  );

  const failed = report.results.filter((result) => result.checked && result.errors.length > 0);
  if (failed.length === 0) {
    lines.push('ok');
    return `${lines.join('\n')}\n`;
  }

  lines.push(`${failed.length} failure${failed.length === 1 ? '' : 's'}:`);
  for (const result of failed) {
    lines.push(`- ${path.relative(cwd, result.filePath)}`);
    for (const error of result.errors) {
      lines.push(`  - ${error}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

async function main(argv) {
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: node scripts/preflight-content.mjs [path ...]');
    console.log('Checks dated content filenames against frontmatter date/pubDate values.');
    return 0;
  }

  const targets = argv.length > 0 ? argv : ['src/content'];
  const report = await runPreflight(targets);
  process.stdout.write(formatReport(report));
  return report.ok ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2))
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exitCode = 1;
    });
}

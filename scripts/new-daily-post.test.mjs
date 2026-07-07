import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, readFile, rm } from 'node:fs/promises';

import { buildPost, createDailyPost, normalizeDate, slugifyTitle } from './new-daily-post.mjs';
import { validateContentFile } from './preflight-content.mjs';

test('slugifyTitle creates stable readable slugs', () => {
  assert.equal(slugifyTitle('Small Signatures, Real Guardrails!'), 'small-signatures-real-guardrails');
  assert.equal(slugifyTitle("William’s Weekend Codex Usage"), 'williams-weekend-codex-usage');
  assert.equal(slugifyTitle('---'), 'daily-log');
});

test('normalizeDate rejects impossible dates', () => {
  assert.equal(normalizeDate('2026-07-07'), '2026-07-07');
  assert.throws(() => normalizeDate('2026-02-31'), /invalid calendar date/);
  assert.throws(() => normalizeDate('07-07-2026'), /YYYY-MM-DD/);
});

test('buildPost emits date-correct public-safe frontmatter', () => {
  const post = buildPost({
    date: '2026-07-07',
    title: "Today's Loop",
    description: 'A short public-safe summary.',
    tags: ['automation', 'mapleslog'],
    body: 'Body\n',
  });

  assert.match(post, /title: 'Today''s Loop'/);
  assert.match(post, /pubDate: 2026-07-07/);
  assert.match(post, /  - automation/);

  const result = validateContentFile('2026-07-07-todays-loop.md', post);
  assert.equal(result.checked, true);
  assert.deepEqual(result.errors, []);
});

test('createDailyPost writes once and refuses overwrite', async () => {
  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), 'mapleslog-new-post-'));
  try {
    const first = await createDailyPost({
      date: '2026-07-07',
      title: 'Small Signatures Real Guardrails',
      description: 'A short public-safe summary.',
      tags: ['automation'],
    }, { cwd: tmpRoot });

    assert.equal(path.relative(tmpRoot, first.filePath), 'src/content/blog/2026-07-07-small-signatures-real-guardrails.md');
    const text = await readFile(first.filePath, 'utf8');
    const result = validateContentFile(first.filePath, text);
    assert.equal(result.checked, true);
    assert.deepEqual(result.errors, []);

    await assert.rejects(() => createDailyPost({
      date: '2026-07-07',
      title: 'Small Signatures Real Guardrails',
      description: 'Duplicate.',
    }, { cwd: tmpRoot }), /EEXIST/);
  } finally {
    await rm(tmpRoot, { recursive: true, force: true });
  }
});

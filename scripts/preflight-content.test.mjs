import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import os from 'node:os';

import {
  formatReport,
  parseFilenameDateRange,
  runPreflight,
  validateContentFile,
} from './preflight-content.mjs';

test('parseFilenameDateRange handles single-day and range filenames', () => {
  assert.deepEqual(parseFilenameDateRange('2026-07-05-clean-preflight-before-dangerous-work.md'), {
    startDate: '2026-07-05',
    endDate: '2026-07-05',
    isRange: false,
  });

  assert.deepEqual(parseFilenameDateRange('2026-05-02-to-05-05-the-quiet-days.md'), {
    startDate: '2026-05-02',
    endDate: '2026-05-05',
    isRange: true,
  });

  assert.deepEqual(parseFilenameDateRange('2026-12-31-to-2027-01-02-year-wrap.md'), {
    startDate: '2026-12-31',
    endDate: '2027-01-02',
    isRange: true,
  });
});

test('validateContentFile accepts matching single-day and range posts', () => {
  const single = validateContentFile(
    '2026-07-05-clean-preflight-before-dangerous-work.md',
    `---\ntitle: Clean preflight\ndate: 2026-07-05\n---\nBody\n`
  );
  assert.equal(single.checked, true);
  assert.deepEqual(single.errors, []);

  const range = validateContentFile(
    '2026-05-02-to-05-05-the-quiet-days.md',
    `---\ntitle: Quiet days\npubDate: '2026-05-05'\n---\nBody\n`
  );
  assert.equal(range.checked, true);
  assert.deepEqual(range.errors, []);
  assert.equal(range.isRange, true);
});

test('validateContentFile reports mismatched filename and frontmatter dates', () => {
  const result = validateContentFile(
    '2026-05-02-to-05-05-the-quiet-days.md',
    `---\ntitle: Quiet days\ndate: 2026-05-04\npubDate: 2026-05-05\n---\nBody\n`
  );

  assert.equal(result.checked, true);
  assert.deepEqual(result.errors, [
    'date (2026-05-04) and pubDate (2026-05-05) do not match',
  ]);
});

test('runPreflight checks real files and reports failures cleanly', async () => {
  const tmpRoot = await mkdtemp(path.join(os.tmpdir(), 'mapleslog-preflight-'));
  const contentDir = path.join(tmpRoot, 'src', 'content', 'blog');

  try {
    await mkdir(contentDir, { recursive: true });
    await writeFile(
      path.join(contentDir, '2026-07-05-clean-preflight-before-dangerous-work.md'),
      `---\ntitle: Clean preflight\ndate: '2026-07-05'\n---\nBody\n`
    );
    await writeFile(
      path.join(contentDir, '2026-05-02-to-05-05-the-quiet-days.md'),
      `---\ntitle: Quiet days\ndate: '2026-05-04'\n---\nBody\n`
    );
    await writeFile(
      path.join(contentDir, 'undated-note.md'),
      `---\ntitle: Note\ndate: '2026-07-05'\n---\nBody\n`
    );

    const report = await runPreflight(['src/content'], { cwd: tmpRoot });
    assert.equal(report.ok, false);
    assert.equal(report.checkedCount, 2);
    assert.equal(report.skippedCount, 1);
    assert.equal(report.failedCount, 1);

    const rendered = formatReport(report, { cwd: tmpRoot });
    assert.match(rendered, /checked 2 dated content files \(1 skipped without filename dates\)/);
    assert.match(rendered, /2026-05-02-to-05-05-the-quiet-days\.md/);
    assert.match(rendered, /frontmatter date 2026-05-04 does not match filename date 2026-05-05/);
  } finally {
    await rm(tmpRoot, { recursive: true, force: true });
  }
});

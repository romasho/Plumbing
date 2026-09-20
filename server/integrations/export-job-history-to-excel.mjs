import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = join(here, '..', '..');
const dataFile = join(projectRoot, 'server', 'data', 'jobs.json');
const outputFile = join(projectRoot, 'exports', 'ymc-plumbing-job-history.csv');

function csvCell(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const jobs = JSON.parse(await readFile(dataFile, 'utf8'));
const rows = [
  ['Job ID', 'Customer', 'Technician', 'Job Type', 'Status', 'Scheduled at', 'Activity', 'Activity at'],
];

for (const job of jobs) {
  const scheduledAt = `${job.scheduledDate ?? ''} ${job.startTime ?? ''}`.trim();
  for (const entry of job.activities ?? []) {
    rows.push([
      job.id,
      job.customerName,
      job.technician,
      job.type,
      job.status,
      scheduledAt,
      entry.text,
      entry.at,
    ]);
  }
}

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(outputFile, `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`, 'utf8');
console.log(`Excel-compatible job history exported to ${outputFile}`);

import cors from 'cors';
import express from 'express';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishToGoogleSheets } from './integrations/google-sheets.mjs';
import { publishToSlack } from './integrations/slack.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const dataFile = join(here, 'data', 'jobs.json');
const port = Number(process.env.PORT ?? 3000);
const app = express();
app.use(cors());
app.use(express.json());

const today = new Date().toISOString().slice(0, 10);
const seed = [
  job('JOB-1042', 'John Smith', 'Pipe Leak', 'Mike Torres', 'In Progress', '09:00', '10:30'),
  job('JOB-1041', 'Maya Patel', 'Drain Cleaning', 'Sarah Kim', 'New', '11:00', '12:30'),
  job('JOB-1040', 'Robert Chen', 'Water Heater', 'Mike Torres', 'New', '14:00', '15:30'),
];

function job(id, customerName, type, technician, status, startTime, endTime) {
  return {
    id,
    customerName,
    phone: '(555) 204-0081',
    source: 'Website',
    type,
    description: '',
    address: '1847 Oak Avenue',
    city: 'Austin',
    zip: '78701',
    scheduledDate: today,
    startTime,
    endTime,
    technician,
    status,
    activities: [
      activity(
        status === 'In Progress'
          ? `${technician} started work`
          : `Job created and assigned to ${technician}`,
      ),
    ],
  };
}
function activity(text) {
  return { id: crypto.randomUUID(), text, at: new Date().toISOString() };
}

async function load() {
  if (!existsSync(dataFile)) {
    await save(seed);
    return seed;
  }
  return JSON.parse(await readFile(dataFile, 'utf8'));
}
async function save(jobs) {
  await mkdir(join(here, 'data'), { recursive: true });
  await writeFile(dataFile, JSON.stringify(jobs, null, 2));
}

async function publish(event, job) {
  const payload = {
    event,
    jobId: job.id,
    customer: job.customerName,
    technician: job.technician,
    jobType: job.type,
    status: job.status,
    scheduledAt: `${job.scheduledDate} ${job.startTime}`,
  };
  console.info('[integration event]', payload);
  const results = await Promise.allSettled([
    publishToSlack(process.env.SLACK_WEBHOOK_URL, payload),
    publishToGoogleSheets(process.env.GOOGLE_SHEETS_WEBHOOK_URL, payload),
  ]);
  const [slack, googleSheets] = results;
  if (slack.status === 'rejected') console.error('[Slack publish failed]', slack.reason);
  if (googleSheets.status === 'rejected')
    console.error('[Google Sheets publish failed]', googleSheets.reason);
}

app.get('/api/health', (_request, response) => response.json({ ok: true }));
app.get('/api/jobs', async (_request, response) => response.json(await load()));
app.post('/api/jobs', async (request, response) => {
  const jobs = await load();
  const job = {
    ...request.body,
    id: `JOB-${1040 + jobs.length + 1}`,
    status: 'New',
    activities: [activity('Job created'), activity(`Job assigned to ${request.body.technician}`)],
  };
  jobs.push(job);
  await save(jobs);
  await publish('created and assigned', job);
  response.status(201).json(job);
});
app.patch('/api/jobs/:id/status', async (request, response) => {
  const status = request.body.status;
  if (!['New', 'In Progress', 'Completed', 'Cancelled'].includes(status))
    return response.status(400).json({ error: 'Invalid status' });
  const jobs = await load();
  const index = jobs.findIndex((job) => job.id === request.params.id);
  if (index < 0) return response.status(404).json({ error: 'Job not found' });
  const job = jobs[index];
  job.status = status;
  job.activities.unshift(
    activity(
      status === 'In Progress'
        ? `${job.technician} started work`
        : `Job marked ${status.toLowerCase()}`,
    ),
  );
  await save(jobs);
  await publish(status.toLowerCase(), job);
  response.json(job);
});

app.listen(port, () => console.log(`YMC shared API listening at http://localhost:${port}`));

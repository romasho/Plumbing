# field-task-manager integration

Run the shared service from this repository with `npm run api`. It exposes `http://localhost:3000/api`; for a physical Android/iOS device replace `localhost` with the development computer's LAN IP (for Android Emulator use `http://10.0.2.2:3000/api`).

## REST contract

- `GET /jobs` — all current jobs. Filter them in React Native by `technician` for the signed-in technician.
- `POST /jobs` — dispatcher-only creation. The Angular CRM calls this automatically.
- `PATCH /jobs/:id/status` with `{ "status": "In Progress" | "Completed" | "Cancelled" }` — use when the technician synchronizes a queued mobile change.

The returned `Job` is the source of truth and includes `activities`. Do not generate a parallel history in React Native: the server adds activities for creation, assignment, start, completion and cancellation.

## Minimal React Native API module

```ts
export const API_BASE_URL = 'http://10.0.2.2:3000/api'; // Android emulator

export async function getMyJobs(technician: string) {
  const jobs = await fetch(`${API_BASE_URL}/jobs`).then((response) => response.json());
  return jobs.filter((job: { technician: string }) => job.technician === technician);
}

export async function syncStatus(jobId: string, status: 'In Progress' | 'Completed' | 'Cancelled') {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/status`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Could not synchronize job status');
  return response.json();
}
```

Keep the existing offline queue in `field-task-manager`. When it regains connectivity, send queued changes in local timestamp order with `syncStatus`, then fetch `GET /jobs` to replace stale local data. The Angular FMS polls every five seconds, so the manager sees the synchronized result without a browser refresh.

## Slack and Google Sheets

The API sends a Slack Incoming Webhook payload and a structured Google Apps Script payload on creation/assignment and every status change. Set `SLACK_WEBHOOK_URL` and `GOOGLE_SHEETS_WEBHOOK_URL` only in the terminal/host environment running `npm run api`; neither React Native nor Angular contains secrets.

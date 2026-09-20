/** Send a job update to a Slack Incoming Webhook. */
export async function publishToSlack(url, payload) {
  if (!url) return;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      text: `YMC Plumbing: ${payload.event} — ${payload.jobId} · ${payload.customer} · ${payload.jobType} · ${payload.technician} · ${payload.status} · ${payload.scheduledAt}`,
    }),
  });

  if (!response.ok) throw new Error(`Slack webhook returned ${response.status}`);
}

/** Send a job update to the deployed Google Apps Script Web App. */
export async function publishToGoogleSheets(url, payload) {
  if (!url) return;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Google Sheets webhook returned ${response.status}`);
}

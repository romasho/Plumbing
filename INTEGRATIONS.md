# Google Sheets and Slack setup

Both integrations run only from the shared API process. The Angular and React Native clients never receive integration secrets. The delivery code is kept separately in `server/integrations/google-sheets.mjs` and `server/integrations/slack.mjs`.

## Google Sheets

1. Create a Google Sheet for job history.
2. Open Extensions → Apps Script and replace its code with `integrations/google-apps-script/Code.gs`.
3. In Project Settings → Script properties, add `SPREADSHEET_ID`: the ID from the target spreadsheet URL.
4. Deploy → New deployment → Web app. Run as your account and grant access to the API host. Copy the `/exec` URL.
5. Copy `server/.env.example` to `server/.env` and set `GOOGLE_SHEETS_WEBHOOK_URL` to that URL.

The script uses `Job ID` as its key. It inserts a new row on job creation and updates that same row for assignment and every status event.

## Slack

1. Create or select the manager notification channel in Slack.
2. Add an Incoming Webhook and copy its URL.
3. Set `SLACK_WEBHOOK_URL` in `server/.env`.

The shared API posts a compact message containing job ID, customer, job type, technician, status and scheduled time for every creation/assignment or status update.

## Excel file export

To save the local job activity history as an Excel-compatible CSV file, run:

```powershell
npm run export:excel
```

The file is saved to `exports/ymc-plumbing-job-history.csv`. The `exports` folder is intentionally ignored by Git because it is generated from `server/data/jobs.json`.

## Run

```powershell
Copy-Item server/.env.example server/.env
# Fill in both URLs in server/.env
npm run api
```

Run `npm run dev` to start the API and Angular dispatcher together. Restart the API after changing `server/.env`.

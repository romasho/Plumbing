# AI Context: YMC Plumbing

This is an Angular 22 CRM/FMS demonstration for plumbing dispatch. A manager turns a `Lead` into a scheduled `Job`, assigns a technician, then tracks the statuses `New`, `In Progress`, `Completed`, and `Cancelled`.

## Structure

- `src/app/core/models.ts`: Lead, Job, Activity, and status contract.
- `src/app/core/job.store.ts`: strict signals state and the shared API client.
- `server/server.mjs`: REST API, persistent mock data, activity history and webhook delivery.
- `src/app/features/leads`: CRM intake and job creation entry point.
- `src/app/features/jobs`: FMS job list, detail and status transition controls.
- `src/app/features/shared/job-form.component.*`: guarded Reactive Form with required customer fields.

## Synchronization and integrations

The web client uses `http://localhost:3000/api`, implemented by `server/server.mjs`; persistent mock data lives in `server/data/jobs.json`. `field-task-manager` should use the same API and Job contract. Its offline queue sends status mutations upon reconnect; the web UI polls every five seconds and reflects the updated record.

`server/server.mjs` is the Slack/Google Sheets integration seam. It posts a Slack Incoming Webhook payload and a structured Google Apps Script payload after each creation or status mutation. `integrations/google-apps-script/Code.gs` upserts a Sheet row using `jobId` as the key. Set `SLACK_WEBHOOK_URL` and `GOOGLE_SHEETS_WEBHOOK_URL` in `server/.env`; do not put secrets in Angular or React Native. See `INTEGRATIONS.md` for setup.

## Commands

Use `npm run dev`, `npm run api`, `npm run build`, `npm run lint`, and `npm run format:check`. Strict TypeScript/Angular template settings, Prettier, Angular ESLint, lint-staged and Husky are configured.

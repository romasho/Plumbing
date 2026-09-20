# YMC Plumbing CRM & Field Management

Angular 22 web application for turning plumbing leads into assigned field jobs and following technician progress.

## Run locally

```bash
npm install
npm run dev
```

This starts Angular and the shared API. Open `http://localhost:4200`. Run `npm run build` for a production build, `npm run lint` for ESLint, and `npm run format:check` for Prettier verification. Husky and lint-staged run on commits.

## Technology

Angular standalone components, strict TypeScript, strict Angular templates, Reactive Forms, signals, Prettier, Angular ESLint, Husky and lint-staged.

## Workflow

Open **Leads**, select an incoming request, and create a scheduled job with a technician. It is added to **Field jobs** in `New` status. The FMS can then show `In Progress`, `Completed`, or `Cancelled`; every important event is placed in the activity history.

The app reads the shared mock REST API at `http://localhost:3000/api`; persistent mock data is `server/data/jobs.json` (created on first run). The mobile app uses the same `Job` contract and API. Its offline queue submits the latest status after reconnect, and the web FMS polls every five seconds.

The backend publishes an event after every create/assignment or status update. Set `SLACK_WEBHOOK_URL` to an Incoming Webhook and `GOOGLE_SHEETS_WEBHOOK_URL` to a Google Apps Script web-app URL. Both receive customer, technician, job type, status and scheduled time; credentials remain server-side. See `INTEGRATIONS.md` for the deployment steps and `integrations/google-apps-script/Code.gs` for the Sheet upsert script.

## Important files

- `src/app/core/job.store.ts`: shared API client and web synchronization.
- `src/app/features/leads`: CRM lead workflow.
- `src/app/features/jobs`: FMS tracking workflow.
- `src/app/features/shared/job-form.component.*`: validation and anti-double-submit form.
- `AI_CONTEXT.md`: handoff context for future developers and coding agents.
- `server/server.mjs`: REST API, persistent data, history and integration events.
- `MOBILE_INTEGRATION.md`: exact React Native connection contract.

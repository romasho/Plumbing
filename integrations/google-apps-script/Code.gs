/**
 * YMC Plumbing Google Sheets integration.
 *
 * Set Script Property SPREADSHEET_ID to the target Sheet's ID, then deploy as
 * a Web App: Execute as "Me"; Who has access: the API host. The server POSTs
 * event, jobId, customer, technician, jobType, status and scheduledAt.
 */
const HEADERS = [
  'Job ID',
  'Customer',
  'Technician',
  'Job Type',
  'Status',
  'Scheduled at',
  'Last event',
  'Updated at',
];

function doPost(event) {
  const payload = JSON.parse(event.postData.contents);
  if (!payload.jobId) return reply({ ok: false, error: 'jobId is required' }, 400);

  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) return reply({ ok: false, error: 'Set SPREADSHEET_ID Script Property' }, 500);

  const sheet =
    SpreadsheetApp.openById(spreadsheetId).getSheetByName('Jobs') ||
    SpreadsheetApp.openById(spreadsheetId).insertSheet('Jobs');
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

  const jobIdColumn = sheet
    .getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1)
    .getValues()
    .flat();
  const row = jobIdColumn.findIndex((id) => id === payload.jobId) + 2;
  const values = [
    [
      payload.jobId,
      payload.customer,
      payload.technician,
      payload.jobType,
      payload.status,
      payload.scheduledAt,
      payload.event,
      new Date().toISOString(),
    ],
  ];

  if (row > 1) sheet.getRange(row, 1, 1, HEADERS.length).setValues(values);
  else sheet.getRange(sheet.getLastRow() + 1, 1, 1, HEADERS.length).setValues(values);
  return reply({ ok: true, jobId: payload.jobId });
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

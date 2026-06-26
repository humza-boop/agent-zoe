/**
 * Agent Zoe — 2026 Tax Firm Operations Benchmark Survey
 * Google Apps Script Web App
 *
 * SETUP
 * 1. Create a new project at script.google.com.
 * 2. Paste this entire file into Code.gs.
 * 3. Update SHEET_ID and NOTIFY_EMAIL below.
 * 4. Run → "setup" once to write the header row and formatting.
 * 5. Deploy → New deployment → Web app
 *    Execute as: Me  |  Who has access: Anyone
 * 6. Authorize when prompted.
 * 7. Copy the deployment URL → paste into project/config.js.
 *
 * NOTE: After any code change, create a NEW deployment (not Edit existing).
 * Each new deployment gets a new URL — update config.js accordingly.
 */

// ─── Configuration ──────────────────────────────────────────────────────────

var SHEET_ID     = '1d5XKvyzkog3xiP1GqBGMkHhO2f_5iL4wx0qlrpgcAvY';
var SHEET_NAME   = 'Responses';
var NOTIFY_EMAIL = 'humza@schema52.com';

// ─── Column headers ──────────────────────────────────────────────────────────
// One column per survey question/answer field, plus date and time.

var HEADERS = [
  'date', 'time', 'submission_id', 'completion_status',
  'firm_size', 'returns_filed', 'client_mix', 'client_mix_other',
  'biggest_challenges', 'top_priority', 'workflow_friction',
  'time_loss', 'time_loss_other',
  'current_process', 'current_process_other',
  'process_satisfaction', 'ai_openness',
  'name', 'email', 'firm_name', 'firm_url', 'phone',
  'source_page',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'user_agent', 'device_type',
];

// ─── Web App entry point ─────────────────────────────────────────────────────

function doPost(e) {
  try {
    var data  = e.parameter || {};
    var sheet = getOrCreateSheet();

    // Split the ISO timestamp the client sends into separate date and time columns.
    var ts   = data.timestamp ? new Date(data.timestamp) : new Date();
    var tz   = Session.getScriptTimeZone();
    data.date = Utilities.formatDate(ts, tz, 'yyyy-MM-dd');
    data.time = Utilities.formatDate(ts, tz, 'HH:mm:ss');

    var row = HEADERS.map(function(col) {
      return data[col] !== undefined ? String(data[col]) : '';
    });

    sheet.appendRow(row);

    try { sendNotification(data); } catch (emailErr) {
      Logger.log('Email notification failed (non-fatal): ' + emailErr.message);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'Agent Zoe Survey' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Sheet helpers ───────────────────────────────────────────────────────────

function getOrCreateSheet() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    writeHeaders(sheet);
  }
  return sheet;
}

/**
 * Run this manually (Run → setup) to create or reset the header row.
 * Safe to run any time — clears and rewrites headers without touching response rows.
 */
function setup() {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  // Delete only row 1 so existing responses beneath it are preserved.
  if (sheet.getLastRow() > 0) sheet.deleteRow(1);
  sheet.insertRowBefore(1);
  writeHeaders(sheet);
  Logger.log('Headers written to "' + SHEET_NAME + '".');
}

function writeHeaders(sheet) {
  var range = sheet.getRange(1, 1, 1, HEADERS.length);
  range.setValues([HEADERS]);
  range.setFontWeight('bold');
  range.setBackground('#51624f');
  range.setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
  for (var i = 1; i <= HEADERS.length; i++) sheet.setColumnWidth(i, 160);
}

// ─── Email notification ──────────────────────────────────────────────────────

function sendNotification(data) {
  var ts       = data.timestamp            || new Date().toISOString();
  var firm     = data.firm_name            || '(not provided)';
  var name     = data.name                 || '(anonymous)';
  var email    = data.email                || '—';
  var size     = data.firm_size            || '—';
  var returns  = data.returns_filed        || '—';
  var top      = data.top_priority         || '—';
  var sat      = data.process_satisfaction || '—';
  var interest = data.ai_openness          || '—';
  var source   = data.source_page          || '—';

  var subject = 'Survey response — Agent Zoe (' + name + ', ' + firm + ')';

  var body = [
    'New survey submission received.',
    '',
    'Submitted: ' + ts,
    'Source:    ' + source,
    '',
    '── Respondent ────────────────────────────',
    'Name:      ' + name,
    'Email:     ' + email,
    'Firm:      ' + firm,
    'Size:      ' + size,
    'Returns:   ' + returns + ' per year',
    '',
    '── Key signals ───────────────────────────',
    'Top priority:         ' + top,
    'Process satisfaction: ' + sat,
    'AI openness:          ' + interest,
    '',
    '── Full response ─────────────────────────',
    'https://docs.google.com/spreadsheets/d/' + SHEET_ID,
    '',
    '──────────────────────────────────────────',
    'Agent Zoe · 2026 Tax Firm Operations Benchmark',
  ].join('\n');

  MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: subject, body: body });
}

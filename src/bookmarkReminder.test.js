const {
  addReminder,
  removeReminder,
  getDueReminders,
  dismissReminder,
  formatReminders,
  loadReminders,
  saveReminders,
  resolveReminderPath,
} = require('./bookmarkReminder');
const fs = require('fs');
const os = require('os');
const path = require('path');

const bm = { url: 'https://example.com', title: 'Example' };
const future = '2099-01-01T00:00:00.000Z';
const past = '2000-01-01T00:00:00.000Z';

test('addReminder adds a new entry', () => {
  const result = addReminder([], bm, future, 'check later');
  expect(result).toHaveLength(1);
  expect(result[0].url).toBe(bm.url);
  expect(result[0].note).toBe('check later');
  expect(result[0].dismissed).toBe(false);
});

test('addReminder updates existing entry', () => {
  const r1 = addReminder([], bm, past);
  const r2 = addReminder(r1, bm, future, 'updated');
  expect(r2).toHaveLength(1);
  expect(r2[0].remindAt).toBe(future);
  expect(r2[0].note).toBe('updated');
});

test('removeReminder removes by url', () => {
  const r1 = addReminder([], bm, future);
  const r2 = removeReminder(r1, bm.url);
  expect(r2).toHaveLength(0);
});

test('getDueReminders returns only past and undismissed', () => {
  let reminders = addReminder([], bm, past);
  reminders = addReminder(reminders, { url: 'https://b.com', title: 'B' }, future);
  const due = getDueReminders(reminders, new Date());
  expect(due).toHaveLength(1);
  expect(due[0].url).toBe(bm.url);
});

test('dismissReminder marks as dismissed', () => {
  const r1 = addReminder([], bm, past);
  const r2 = dismissReminder(r1, bm.url);
  expect(r2[0].dismissed).toBe(true);
  expect(r2[0].dismissedAt).toBeDefined();
  expect(getDueReminders(r2)).toHaveLength(0);
});

test('formatReminders returns readable string', () => {
  const reminders = addReminder([], bm, future, 'read this');
  const out = formatReminders(reminders);
  expect(out).toContain('Example');
  expect(out).toContain('read this');
});

test('formatReminders handles empty list', () => {
  expect(formatReminders([])).toBe('No reminders.');
});

test('load/save reminders round-trips', () => {
  const tmpFile = path.join(os.tmpdir(), `reminders-${Date.now()}.json`);
  const reminders = addReminder([], bm, future);
  saveReminders(reminders, tmpFile);
  const loaded = loadReminders(tmpFile);
  expect(loaded).toHaveLength(1);
  expect(loaded[0].url).toBe(bm.url);
  fs.unlinkSync(tmpFile);
});

test('loadReminders returns [] for missing file', () => {
  expect(loadReminders('/nonexistent/path/file.json')).toEqual([]);
});

test('resolveReminderPath uses default when no arg', () => {
  const p = resolveReminderPath(null);
  expect(p).toContain('.tabmerge-reminders.json');
});

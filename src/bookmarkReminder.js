// bookmarkReminder.js — schedule and retrieve bookmark reminders

const fs = require('fs');
const path = require('path');

function resolveReminderPath(filePath) {
  return filePath || path.join(process.cwd(), '.tabmerge-reminders.json');
}

function loadReminders(filePath) {
  const p = resolveReminderPath(filePath);
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return [];
  }
}

function saveReminders(reminders, filePath) {
  const p = resolveReminderPath(filePath);
  fs.writeFileSync(p, JSON.stringify(reminders, null, 2), 'utf8');
}

function addReminder(reminders, bookmark, remindAt, note = '') {
  const existing = reminders.find(r => r.url === bookmark.url);
  if (existing) {
    existing.remindAt = remindAt;
    existing.note = note;
    existing.updatedAt = new Date().toISOString();
    return reminders;
  }
  return [
    ...reminders,
    {
      url: bookmark.url,
      title: bookmark.title || '',
      remindAt,
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dismissed: false,
    },
  ];
}

function removeReminder(reminders, url) {
  return reminders.filter(r => r.url !== url);
}

function getDueReminders(reminders, now = new Date()) {
  return reminders.filter(r => !r.dismissed && new Date(r.remindAt) <= now);
}

function dismissReminder(reminders, url) {
  return reminders.map(r =>
    r.url === url ? { ...r, dismissed: true, dismissedAt: new Date().toISOString() } : r
  );
}

function formatReminders(reminders) {
  if (!reminders.length) return 'No reminders.';
  return reminders
    .map(r => `[${r.dismissed ? 'x' : ' '}] ${r.remindAt}  ${r.title || r.url}${r.note ? '  — ' + r.note : ''}`)
    .join('\n');
}

module.exports = {
  resolveReminderPath,
  loadReminders,
  saveReminders,
  addReminder,
  removeReminder,
  getDueReminders,
  dismissReminder,
  formatReminders,
};

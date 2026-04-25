// bookmarkNotes.js — attach and manage freeform notes on bookmarks

const fs = require('fs');
const path = require('path');

function resolveNotesPath(notesPath) {
  return notesPath || path.join(process.cwd(), '.tabmerge-notes.json');
}

function loadNotes(notesPath) {
  const file = resolveNotesPath(notesPath);
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function saveNotes(notes, notesPath) {
  const file = resolveNotesPath(notesPath);
  fs.writeFileSync(file, JSON.stringify(notes, null, 2), 'utf8');
}

function addNote(bookmarks, url, text, notesPath) {
  const notes = loadNotes(notesPath);
  notes[url] = { text, updatedAt: new Date().toISOString() };
  saveNotes(notes, notesPath);
  return bookmarks.map(b =>
    b.url === url ? { ...b, note: text } : b
  );
}

function removeNote(bookmarks, url, notesPath) {
  const notes = loadNotes(notesPath);
  delete notes[url];
  saveNotes(notes, notesPath);
  return bookmarks.map(b => {
    if (b.url !== url) return b;
    const { note, ...rest } = b;
    return rest;
  });
}

function applyNotes(bookmarks, notesPath) {
  const notes = loadNotes(notesPath);
  return bookmarks.map(b => {
    const entry = notes[b.url];
    return entry ? { ...b, note: entry.text } : b;
  });
}

function getAnnotatedWithNotes(bookmarks) {
  return bookmarks.filter(b => b.note && b.note.trim().length > 0);
}

module.exports = {
  resolveNotesPath,
  loadNotes,
  saveNotes,
  addNote,
  removeNote,
  applyNotes,
  getAnnotatedWithNotes
};

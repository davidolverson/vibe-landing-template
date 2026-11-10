import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(path.join(DB_DIR, 'vibe.db'));
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    business_types TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'new',
    notes TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const jsonPath = path.join(process.cwd(), 'waitlist.json');
if (fs.existsSync(jsonPath)) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const insert = db.prepare(
    'INSERT OR IGNORE INTO leads (name, email, business_types, created_at) VALUES (?, ?, ?, ?)'
  );
  for (const entry of data.emails || []) {
    insert.run('', entry.email, '[]', entry.timestamp || new Date().toISOString());
  }
  console.log(`Migrated ${(data.emails || []).length} entries from waitlist.json`);
} else {
  console.log('No waitlist.json found, skipping migration');
}

db.close();

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Vercel serverless has a read-only filesystem except /tmp.
// Use /tmp on Vercel so SQLite can create/write the DB file.
// Data in /tmp is ephemeral (cleared between cold starts) — the Resend
// email notification is the durable audit trail for signups.
const isVercel = !!process.env.VERCEL;
const DB_DIR = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'vibe.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// WAL mode for better concurrent reads
db.pragma('journal_mode = WAL');

// Create leads table
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

export type LeadStatus = 'new' | 'contacted' | 'interested' | 'onboarding' | 'active';

export interface Lead {
  id: number;
  name: string;
  email: string;
  business_types: string; // JSON array stored as text
  status: LeadStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export const insertLead = db.prepare<[string, string, string]>(
  `INSERT INTO leads (name, email, business_types) VALUES (?, ?, ?)
   ON CONFLICT(email) DO UPDATE SET
     name = excluded.name,
     business_types = excluded.business_types,
     updated_at = datetime('now')`
);

export const getAllLeads = db.prepare(
  `SELECT * FROM leads ORDER BY created_at DESC`
);

export const getLeadById = db.prepare<[number]>(
  `SELECT * FROM leads WHERE id = ?`
);

export const updateLeadStatus = db.prepare<[string, string, number]>(
  `UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?`
).bind;

export const updateLeadNotes = db.prepare<[string, string, number]>(
  `UPDATE leads SET notes = ?, updated_at = datetime('now') WHERE id = ?`
);

export const updateLead = db.prepare(
  `UPDATE leads SET status = ?, notes = ?, updated_at = datetime('now') WHERE id = ?`
);

export const getLeadStats = () => {
  const total = (db.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number }).count;
  const byStatus = db.prepare(
    'SELECT status, COUNT(*) as count FROM leads GROUP BY status'
  ).all() as { status: string; count: number }[];
  return { total, byStatus };
};

export default db;

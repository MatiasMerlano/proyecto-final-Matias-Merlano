import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const dataDir=path.resolve(here,'../../data');
fs.mkdirSync(dataDir,{recursive:true});
const db=new Database(path.join(dataDir,'robotcare-portfolio.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`
 CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
 CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, source TEXT NOT NULL DEFAULT 'website', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
`);
export default db;

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'astromath.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance concurrency
db.pragma('journal_mode = WAL');

// Initialize SQL Schema (Cloudflare D1 / SQLite Compatible)
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      is_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS birth_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      dob TEXT NOT NULL,
      tob TEXT NOT NULL,
      city TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      timezone REAL NOT NULL,
      chart_data_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS chat_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      role TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

// User Queries
export const getUserByEmail = (email) => {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
};

export const getUserById = (id) => {
  return db.prepare('SELECT id, name, email, mobile, is_verified, created_at FROM users WHERE id = ?').get(id);
};

export const createUser = (name, email, mobile, passwordHash) => {
  const stmt = db.prepare(`
    INSERT INTO users (name, email, mobile, password_hash, is_verified)
    VALUES (?, ?, ?, ?, 0)
  `);
  const info = stmt.run(name, email, mobile, passwordHash);
  return info.lastInsertRowid;
};

export const verifyUser = (email) => {
  db.prepare('UPDATE users SET is_verified = 1 WHERE email = ?').run(email);
};

// OTP Queries
export const saveOTP = (email, otpCode, expiresAt) => {
  // Clear any existing active OTP for this email
  db.prepare('DELETE FROM otps WHERE email = ?').run(email);
  const stmt = db.prepare('INSERT INTO otps (email, otp_code, expires_at) VALUES (?, ?, ?)');
  stmt.run(email, otpCode, expiresAt.toISOString());
};

export const getLatestOTP = (email) => {
  return db.prepare('SELECT * FROM otps WHERE email = ? ORDER BY id DESC LIMIT 1').get(email);
};

export const deleteOTP = (email) => {
  db.prepare('DELETE FROM otps WHERE email = ?').run(email);
};

export default db;

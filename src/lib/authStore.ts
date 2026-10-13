import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'ADMIN' | 'OWNER';
  displayName: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const USERS_FILE = path.join(DATA_DIR, 'localUsers.json');

// Default initial accounts with bcrypt hashes for 'admin123' and 'owner123'
const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'user-admin-default',
    username: 'admin',
    email: 'admin@thehungersspot.com',
    passwordHash: '$2b$10$aSTWnU.PpYP77vOOOn16WuSro2a9egwj1UCdAiTm4jKV1xhbf9ICO',
    role: 'ADMIN',
    displayName: 'Super Admin',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-owner-default',
    username: 'owner',
    email: 'owner@thehungersspot.com',
    passwordHash: '$2b$10$oW515qj2ee3LUWwqdlGEEO7mL4f.nlZQORIA9pXtWLzHGFle4OWmu',
    role: 'OWNER',
    displayName: 'Restaurant Owner',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

function ensureFileExists(): StoredUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), 'utf-8');
      return DEFAULT_USERS;
    }
    const content = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(content) as StoredUser[];
  } catch (err) {
    console.warn('[AUTH_STORE] Error reading localUsers.json, using fallback:', err);
    return DEFAULT_USERS;
  }
}

export function getAllLocalUsers(): StoredUser[] {
  return ensureFileExists();
}

export function findLocalUser(identifier: string): StoredUser | null {
  const users = ensureFileExists();
  const idLower = identifier.trim().toLowerCase();
  return users.find(u => u.email.toLowerCase() === idLower || u.username.toLowerCase() === idLower) || null;
}

export function saveLocalUser(user: StoredUser): void {
  try {
    const users = ensureFileExists();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[AUTH_STORE] Error writing to localUsers.json:', err);
  }
}

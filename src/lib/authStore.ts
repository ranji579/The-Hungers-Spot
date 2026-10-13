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

const BUNDLED_FILE = path.join(process.cwd(), 'src', 'data', 'localUsers.json');
const RUNTIME_FILE = process.env.VERCEL ? path.join('/tmp', 'localUsers.json') : BUNDLED_FILE;

// In-memory cache fallback if file system is inaccessible
let memoryUsers: StoredUser[] | null = null;

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
  if (memoryUsers && memoryUsers.length > 0) {
    return memoryUsers;
  }
  try {
    if (fs.existsSync(RUNTIME_FILE)) {
      const content = fs.readFileSync(RUNTIME_FILE, 'utf-8');
      memoryUsers = JSON.parse(content) as StoredUser[];
      return memoryUsers;
    }
    if (fs.existsSync(BUNDLED_FILE)) {
      const content = fs.readFileSync(BUNDLED_FILE, 'utf-8');
      const loaded = JSON.parse(content) as StoredUser[];
      memoryUsers = loaded;
      if (process.env.VERCEL) {
        try {
          fs.writeFileSync(RUNTIME_FILE, JSON.stringify(loaded, null, 2), 'utf-8');
        } catch {}
      }
      return loaded;
    }
    memoryUsers = DEFAULT_USERS;
    return DEFAULT_USERS;
  } catch (err) {
    console.warn('[AUTH_STORE] Error reading local users, using fallback:', err);
    memoryUsers = DEFAULT_USERS;
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
    const users = [...ensureFileExists()];
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    memoryUsers = users;
    fs.writeFileSync(RUNTIME_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[AUTH_STORE] Error writing users file:', err);
  }
}

/**
 * Supabase Seed Script
 * Run after setting DATABASE_URL in .env:
 *   npx tsx prisma/seed.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  console.log('🌱 Seeding Supabase database...\n');

  // Clear existing users
  await (prisma as any).user.deleteMany();

  const SALT = 10;

  // Admin user
  const adminHash = await bcrypt.hash('admin@123', SALT);
  await (prisma as any).user.create({
    data: {
      username: 'admin',
      email: 'admin@thehungersspot.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      displayName: 'Super Admin',
    },
  });

  // Owner user
  const ownerHash = await bcrypt.hash('owner@123', SALT);
  await (prisma as any).user.create({
    data: {
      username: 'owner',
      email: 'owner@thehungersspot.com',
      passwordHash: ownerHash,
      role: 'OWNER',
      displayName: 'Restaurant Owner',
    },
  });

  console.log('✅ Users created successfully!\n');
  console.log('   🛡️  Admin  ->  username: admin  |  password: admin@123');
  console.log('   👨‍🍳 Owner  ->  username: owner  |  password: owner@123\n');
  console.log('🎉 Supabase database seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await (prisma as any).$disconnect();
  });

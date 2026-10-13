import { PrismaClient } from '@/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

// Prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | null | undefined;
}

function createPrismaClient(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('[PRISMA] DATABASE_URL environment variable is not set. Database operations will fall back to local storage.');
    return null;
  }
  try {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter } as never);
  } catch (err) {
    console.warn('[PRISMA] Failed to initialize Prisma Client:', err);
    return null;
  }
}

const prisma: PrismaClient | null = global.prisma !== undefined ? global.prisma : createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;

const bcrypt = require('bcryptjs');
const path = require('path');

// Load the generated Prisma client
const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash('admin@123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@thehungersspot.com',
      passwordHash: adminHash,
      role: 'ADMIN',
      displayName: 'Super Admin',
    },
  });

  const ownerHash = await bcrypt.hash('owner@123', 10);
  await prisma.user.create({
    data: {
      username: 'owner',
      email: 'owner@thehungersspot.com',
      passwordHash: ownerHash,
      role: 'OWNER',
      displayName: 'Restaurant Owner',
    },
  });

  console.log('SUCCESS: Database seeded with admin and owner users!');
  console.log('  Admin  -> username: admin  | password: admin@123');
  console.log('  Owner  -> username: owner  | password: owner@123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

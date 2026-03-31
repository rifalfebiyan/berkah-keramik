
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    const usersCount = await prisma.user.count();
    console.log('Total users in DB:', usersCount);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Failed to connect:', error);
  }
}

main();

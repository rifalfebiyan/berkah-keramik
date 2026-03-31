const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'rifalfebiyan123@gmail.com' }
  });
  console.log('User found:', user ? 'YES' : 'NO');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

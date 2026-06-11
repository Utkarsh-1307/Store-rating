require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPass = await bcrypt.hash('Admin@12345', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@storerating.com' },
    update: {},
    create: {
      name: 'Super Administrator Account',
      email: 'admin@storerating.com',
      password: adminPass,
      role: 'ADMIN',
    },
  });
  console.log('Admin:', admin.email, '/ password: Admin@12345');

  const ownerPass = await bcrypt.hash('Owner@12345', 10);
  const owner = await prisma.user.upsert({
    where: { email: 'owner@storerating.com' },
    update: {},
    create: {
      name: 'Demo Store Owner Account',
      email: 'owner@storerating.com',
      password: ownerPass,
      role: 'STORE_OWNER',
    },
  });
  console.log('Store owner:', owner.email, '/ password: Owner@12345');

  const store = await prisma.store.upsert({
    where: { email: 'demo@coffeeshop.com' },
    update: {},
    create: {
      name: 'The Great Demo Coffee Shop',
      email: 'demo@coffeeshop.com',
      address: '123 Main Street, Downtown, Springfield, IL 62701, USA',
      ownerId: owner.id,
    },
  });
  console.log('Store:', store.name);

  const userPass = await bcrypt.hash('User@12345', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@storerating.com' },
    update: {},
    create: {
      name: 'Regular User Demo Account',
      email: 'user@storerating.com',
      password: userPass,
      role: 'USER',
    },
  });
  console.log('Regular user:', user.email, '/ password: User@12345');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

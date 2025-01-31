import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roles = [
  { name: 'Student', description: 'A student role with limited permissions.' },
  { name: 'System Admin', description: 'An admin role with full system access.' },
  { name: 'Financial Assistance Coordinator', description: 'Handles financial assistance tasks.' },
  { name: 'Sponsor', description: 'External sponsor providing funds.' },
  { name: 'Budget Office', description: 'Manages the budget and expenses.' },
  { name: 'Mayor’s Office', description: 'Involved in local government decisions.' },
  { name: 'Treasurer’s Office', description: 'Manages financial accounts and transactions.' },
  { name: 'Cashier', description: 'Handles cash transactions for the organization.' },
  { name: 'Accounting', description: 'Oversees financial records and reporting.' },
];

async function seed() {
  try {
    await prisma.roles.createMany({
      data: roles,
      skipDuplicates: true,
    });

    console.log('Roles seeded successfully!');
  } catch (e) {
    console.error('Error seeding roles:', e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

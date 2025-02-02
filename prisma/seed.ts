import { PrismaClient } from '@prisma/client';
import { uuidToBinary } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

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
  { name: 'Accounting', description: 'Oversees financial records and reporting.' }
];

async function roleSeed() {
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

async function adminUser() {
  try {

    const hashedPassword = await bcrypt.hash("12345678", 10);
    const user = await prisma.user.create({
      data: {
        user_id: uuidToBinary(uuidv4()),                
        email: "admin@gmail.com",
        first_name: "John",
        last_name: "Doe",
        mobile_number: "09382716281",     
        password: hashedPassword     
      }
    });

    await prisma.role_user.create({
      data: {
        user_id: user.id,
        role_id: 2
      },
    });

    console.log('User admin seeded successfully!');
  } catch (e) {
    console.error('Error seeding user admin:', e);
  } finally {
    await prisma.$disconnect();
  }
}

roleSeed();
adminUser();

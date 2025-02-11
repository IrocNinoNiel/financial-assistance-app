import { PrismaClient } from '@prisma/client';
import { uuidToBinary } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function roleSeed() {
  try {

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
    await prisma.user.create({
      data: {
        user_id: uuidToBinary(uuidv4()),
        role_id: 2,                
        email: "admin@gmail.com",
        first_name: "John",
        last_name: "Doe",
        mobile_number: "09382716281",     
        password: hashedPassword     
      }
    });

    console.log('User admin seeded successfully!');
  } catch (e) {
    console.error('Error seeding user admin:', e);
  } finally {
    await prisma.$disconnect();
  }
}

async function initialModuleAndPermission() {
  await prisma.module.createMany({
    data: [
      { name: "Dashboard", sorter: 1, recordStatus: true },
      { name: "Profile", sorter: 2, recordStatus: true }
    ],
    skipDuplicates: true, // Avoid inserting duplicates
  });
  console.log("✅ Module table seeded successfully!");

  await prisma.modulePermission.createMany({
    data: [
      { role_id: 1, module_id: 1, show: true, edit: true, save: true, delete: true },
      { role_id: 1, module_id: 2, show: true, edit: true, save: true, delete: true },
      { role_id: 2, module_id: 1, show: true, edit: true, save: true, delete: true },
      { role_id: 2, module_id: 2, show: true, edit: true, save: true, delete: true },
      { role_id: 3, module_id: 1, show: true, edit: true, save: true, delete: true },
      { role_id: 3, module_id: 2, show: true, edit: true, save: true, delete: true },
      { role_id: 4, module_id: 1, show: true, edit: true, save: true, delete: true },
      { role_id: 4, module_id: 2, show: true, edit: true, save: true, delete: true },
      { role_id: 5, module_id: 1, show: true, edit: true, save: true, delete: true },
      { role_id: 5, module_id: 2, show: true, edit: true, save: true, delete: true },
      { role_id: 6, module_id: 1, show: true, edit: true, save: true, delete: true },
      { role_id: 6, module_id: 2, show: true, edit: true, save: true, delete: true },
      { role_id: 7, module_id: 1, show: true, edit: true, save: true, delete: true },
      { role_id: 7, module_id: 2, show: true, edit: true, save: true, delete: true },
      { role_id: 8, module_id: 1, show: true, edit: true, save: true, delete: true },
      { role_id: 8, module_id: 2, show: true, edit: true, save: true, delete: true },
      { role_id: 9, module_id: 1, show: true, edit: true, save: true, delete: true },
      { role_id: 9, module_id: 2, show: true, edit: true, save: true, delete: true }
    ],
    skipDuplicates: true,
  });
  console.log("✅ ModulePermission table seeded successfully!");
}


roleSeed();
adminUser();
initialModuleAndPermission();
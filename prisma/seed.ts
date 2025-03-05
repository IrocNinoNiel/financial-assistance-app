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
    
    await prisma.role.createMany({
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

    const role = await prisma.role.findUnique({
      where: { name: "System Admin" }, // Adjust based on your schema
      select: { id: true },
    });

    const hashedPassword = await bcrypt.hash("12345678", 10);
    await prisma.user.create({
      data: {
        role_id: role.id,                
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
  try {
    // Insert modules
    await prisma.module.createMany({
      data: [
        {  name: "Dashboard", sorter: 1, record_status: true },
        {  name: "Profile", sorter: 2, record_status: true },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Module table seeded successfully!");

    // Fetch role UUIDs
    const roles = await prisma.role.findMany({
      select: { id: true },
    });

    // Fetch module UUIDs
    const modules = await prisma.module.findMany({
      select: { id: true, name: true },
    });

    if (roles.length === 0 || modules.length === 0) {
      throw new Error("No roles or modules found!");
    }

    // Map modules to find correct IDs
    const dashboardModule = modules.find((m) => m.name === "Dashboard")?.id;
    const profileModule = modules.find((m) => m.name === "Profile")?.id;

    if (!dashboardModule || !profileModule) {
      throw new Error("Modules not found!");
    }

    // Generate permissions dynamically for each role
    const permissions = roles.flatMap((role) => [
      { role_id: role.id, module_id: dashboardModule, show: true, edit: true, save: true, delete: true },
      { role_id: role.id, module_id: profileModule, show: true, edit: true, save: true, delete: true },
    ]);

    // Insert permissions
    await prisma.modulePermission.createMany({
      data: permissions,
      skipDuplicates: true,
    });

    console.log("✅ ModulePermission table seeded successfully!");
  } catch (e) {
    console.error("Error seeding modules and permissions:", e);
  } finally {
    await prisma.$disconnect();
  }
}

async function fileType() {
  const fileTypes = [
    { name: 'Birth Certificate' },
    { name: 'Form 137' },
    { name: 'Form 138' },
    { name: 'Certificate of Good Moral Character' },
    { name: 'Barangay Clearance' },
    { name: 'Proof of Residency' },
    { name: 'Proof of Income' },
    { name: 'Valid ID' },
    { name: 'Scholarship Application Form' },
    { name: '2x2 ID Picture' },
    { name: 'Recommendation Letter' },
  ];

  await prisma.fileType.createMany({
    data: fileTypes,
    skipDuplicates: true,
  });

  console.log('✅ File types seeded successfully!');
}


// roleSeed();
// initialModuleAndPermission();
// fileType();
adminUser();
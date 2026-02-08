import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
})

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('🌱 Starting seed...');

  // Create Permissions
  console.log('Creating permissions...');
  const permissions = await Promise.all([
    // User permissions
    prisma.permission.upsert({
      where: { name: 'users.view' },
      update: {},
      create: { name: 'users.view' },
    }),
    prisma.permission.upsert({
      where: { name: 'users.create' },
      update: {},
      create: { name: 'users.create' },
    }),
    prisma.permission.upsert({
      where: { name: 'users.edit' },
      update: {},
      create: { name: 'users.edit' },
    }),
    prisma.permission.upsert({
      where: { name: 'users.delete' },
      update: {},
      create: { name: 'users.delete' },
    }),
    // Role permissions
    prisma.permission.upsert({
      where: { name: 'roles.view' },
      update: {},
      create: { name: 'roles.view' },
    }),
    prisma.permission.upsert({
      where: { name: 'roles.create' },
      update: {},
      create: { name: 'roles.create' },
    }),
    prisma.permission.upsert({
      where: { name: 'roles.edit' },
      update: {},
      create: { name: 'roles.edit' },
    }),
    prisma.permission.upsert({
      where: { name: 'roles.delete' },
      update: {},
      create: { name: 'roles.delete' },
    }),
    // Permission permissions
    prisma.permission.upsert({
      where: { name: 'permissions.view' },
      update: {},
      create: { name: 'permissions.view' },
    }),
    prisma.permission.upsert({
      where: { name: 'permissions.create' },
      update: {},
      create: { name: 'permissions.create' },
    }),
    prisma.permission.upsert({
      where: { name: 'permissions.edit' },
      update: {},
      create: { name: 'permissions.edit' },
    }),
    prisma.permission.upsert({
      where: { name: 'permissions.delete' },
      update: {},
      create: { name: 'permissions.delete' },
    }),
  ]);
  console.log(`✅ Created ${permissions.length} permissions`);

  // Create Roles
  console.log('Creating roles...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin' },
  });

  const clientRole = await prisma.role.upsert({
    where: { name: 'Client' },
    update: {},
    create: { name: 'Client' },
  });
  console.log('✅ Created roles: Admin, Client');

  // Assign all permissions to Admin role
  console.log('Assigning permissions to Admin role...');
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log('✅ Admin has all permissions');

  // Assign view permissions to Client role
  console.log('Assigning permissions to Client role...');
  const viewPermissions = permissions.filter(p => p.name.endsWith('.view'));
  for (const permission of viewPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: clientRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: clientRole.id,
        permissionId: permission.id,
      },
    });
  }
  console.log('✅ Client has view permissions');

  // Create Users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });

  // Assign Admin role to admin user
  await prisma.userRoles.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });
  console.log('✅ Created admin user: admin@example.com');

  // Client user
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      name: 'Client User',
      email: 'client@example.com',
      password: hashedPassword,
    },
  });

  // Assign Client role to client user
  await prisma.userRoles.upsert({
    where: {
      userId_roleId: {
        userId: clientUser.id,
        roleId: clientRole.id,
      },
    },
    update: {},
    create: {
      userId: clientUser.id,
      roleId: clientRole.id,
    },
  });
  console.log('✅ Created client user: client@example.com');

  console.log('');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('Login credentials:');
  console.log('  Admin: admin@example.com / password123');
  console.log('  Client: client@example.com / password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
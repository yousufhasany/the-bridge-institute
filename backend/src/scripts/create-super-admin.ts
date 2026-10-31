/**
 * Secure bootstrap for the first Super Admin.
 *
 *   npm run admin:create -- --email admin@example.org --name "Full Name"
 *
 * The password is read from the SUPER_ADMIN_PASSWORD environment variable or typed at a
 * hidden prompt. It is never accepted as a command-line argument (shell history) and never logged.
 */
import { createInterface } from 'node:readline';
import { prisma } from '../lib/prisma.js';
import { hashPassword, passwordSchemaRules } from '../services/auth.service.js';

function arg(name: string) {
  const index = process.argv.indexOf(`--${name}`);
  return index > -1 ? process.argv[index + 1] : undefined;
}

function promptHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const output = rl as unknown as { _writeToOutput: (s: string) => void; output: NodeJS.WriteStream };
    let muted = false;
    output._writeToOutput = (s: string) => {
      if (!muted || s.includes('\n')) output.output.write(s);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
    muted = true;
  });
}

async function main() {
  const email = arg('email')?.trim().toLowerCase();
  const fullName = arg('name')?.trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !fullName) {
    console.error('Usage: npm run admin:create -- --email <email> --name "<full name>"');
    process.exit(1);
  }

  const password = process.env.SUPER_ADMIN_PASSWORD ?? (await promptHidden('Password (min 10 characters): '));
  if (password.length < passwordSchemaRules.min || password.length > passwordSchemaRules.max) {
    console.error(`Password must be between ${passwordSchemaRules.min} and ${passwordSchemaRules.max} characters.`);
    process.exit(1);
  }
  if (!process.env.SUPER_ADMIN_PASSWORD) {
    const confirm = await promptHidden('Confirm password: ');
    if (confirm !== password) {
      console.error('Passwords do not match.');
      process.exit(1);
    }
  }

  const role = await prisma.role.findUnique({ where: { key: 'SUPER_ADMIN' } });
  if (!role) {
    console.error('Roles are missing. Run the database seed first: npm run db:seed');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, fullName, isActive: true },
    create: { email, fullName, passwordHash },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });
  await prisma.auditLog.create({ data: { action: 'user.super_admin_bootstrap', entityType: 'User', entityId: user.id } });
  console.log(`Super Admin ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

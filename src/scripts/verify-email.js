#!/usr/bin/env node

// Usage: node scripts/verify-email.js user@example.com

import { prisma } from "../lib/prisma.js";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email. Usage: node scripts/verify-email.js user@example.com");
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.error(`User not found for email: ${email}`);
      process.exit(1);
    }

    if (user.isEmailVerified) {
      console.log(`User ${email} is already verified.`);
      process.exit(0);
    }

    await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        verificationToken: null,
      },
    });

    console.log(`Email verified successfully for ${email}.`);
  } catch (err) {
    console.error("Error verifying email:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

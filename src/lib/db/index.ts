/* eslint-disable @typescript-eslint/no-require-imports */
// PrismaClient is imported via require because the generated client
// doesn't exist until `prisma generate` is run against a real database.
// This is expected — run `npx prisma generate` during setup.

let prisma: any

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  prisma = new (require('@prisma/client').PrismaClient)({
    log: ['error'],
  })
} else {
  const globalForPrisma = globalThis as any
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new (require('@prisma/client').PrismaClient)({
      log: ['error', 'warn'],
    })
  }
  prisma = globalForPrisma.prisma
}

export { prisma }

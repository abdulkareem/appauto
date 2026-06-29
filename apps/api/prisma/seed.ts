import { PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();
async function main() { await prisma.user.upsert({ where: { mobile: '+910000000000' }, update: {}, create: { mobile: '+910000000000', name: 'Demo Customer', role: UserRole.CUSTOMER } }); }
main().finally(async () => prisma.$disconnect());

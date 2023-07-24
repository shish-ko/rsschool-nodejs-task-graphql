import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const memberTypes = [
  { id: 'basic', postsLimitPerMonth: 10, discount: 2.3 },
  { id: 'business', postsLimitPerMonth: 100, discount: 7.7 },
];

for (const memberType of memberTypes) {
  await prisma.memberType.create({
    data: memberType,
  });
}

await prisma.$disconnect();

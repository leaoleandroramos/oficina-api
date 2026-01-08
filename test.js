require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

(async () => {
  await prisma.$connect();
  console.log("Prisma conectou com sucesso");
  await prisma.$disconnect();
})();

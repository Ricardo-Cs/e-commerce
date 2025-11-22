const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: "Ricardo Costa",
        email: "ricardo@gmail.com",
        password: "123456789",
        isAdmin: true,
      },
      {
        name: "Pedro Sales",
        email: "pedro@gmail.com",
        password: "123456789",
        isAdmin: true,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seed OK");
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });

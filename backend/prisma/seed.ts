import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  //Populando tabela de equipe
  try {
    const teams = [
      { name: 'Beta' },
      { name: 'Ômega' },
      { name: 'Gama' },
      { name: 'Delta' },
    ];
    await prisma.team.createMany({
      data: teams,
    });

    // Criando adm
    await prisma.user.create({
      data: {
        name: 'Galvão Alves',
        cpf: '51103282000',
        password: '123456',
        role: 0,
      },
    });

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
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

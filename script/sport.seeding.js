const prisma=require("../lib/prismaClient")

async function seedingsports() {
     const sportsData = [
    { name: 'Football' },
    { name: 'Cricket' },
    { name: 'Basketball' },
    { name: 'Tennis' },
    { name: 'Badminton' },
    { name: 'Swimming' },
    { name: 'Volleyball' },
    { name: 'Athletics' },
    { name: 'Boxing' },
    { name: 'Table Tennis' },
  ];

  await prisma.sport.createMany({
    data:{
        sportsData
    }
  })
}
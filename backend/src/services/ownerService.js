const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');

async function getDashboard(ownerId) {
  const store = await prisma.store.findFirst({ where: { ownerId } });
  if (!store) throw new ApiError(404, 'No store found for this owner');

  const agg = await prisma.rating.aggregate({
    where: { storeId: store.id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const ratings = await prisma.rating.findMany({
    where: { storeId: store.id },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    store: { id: store.id, name: store.name, email: store.email, address: store.address },
    averageRating: agg._avg.rating ? parseFloat(agg._avg.rating.toFixed(1)) : null,
    totalRatings: agg._count.rating,
    ratings,
  };
}

async function getRatings(ownerId) {
  const store = await prisma.store.findFirst({ where: { ownerId } });
  if (!store) throw new ApiError(404, 'No store found for this owner');

  return prisma.rating.findMany({
    where: { storeId: store.id },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

module.exports = { getDashboard, getRatings };

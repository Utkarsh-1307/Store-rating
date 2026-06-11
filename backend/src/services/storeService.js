const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');

async function getStores(search, userId) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ],
      }
    : undefined;

  const stores = await prisma.store.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true } },
      _count: { select: { ratings: true } },
    },
    orderBy: { name: 'asc' },
  });

  const aggregates = await Promise.all(
    stores.map((s) =>
      prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { rating: true } })
    )
  );

  let userRatingsMap = {};
  if (userId && stores.length > 0) {
    const userRatings = await prisma.rating.findMany({
      where: { userId, storeId: { in: stores.map((s) => s.id) } },
      select: { storeId: true, id: true, rating: true },
    });
    userRatings.forEach((r) => { userRatingsMap[r.storeId] = r; });
  }

  return stores.map((store, i) => ({
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    owner: store.owner,
    averageRating: aggregates[i]._avg.rating
      ? parseFloat(aggregates[i]._avg.rating.toFixed(1))
      : null,
    totalRatings: store._count.ratings,
    userRating: userRatingsMap[store.id] ?? null,
  }));
}

async function getStoreById(id, userId) {
  const store = await prisma.store.findUnique({
    where: { id },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
  if (!store) throw new ApiError(404, 'Store not found');

  const agg = await prisma.rating.aggregate({
    where: { storeId: id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  let userRating = null;
  if (userId) {
    userRating = await prisma.rating.findUnique({
      where: { userId_storeId: { userId, storeId: id } },
      select: { id: true, rating: true, createdAt: true, updatedAt: true },
    });
  }

  return {
    ...store,
    averageRating: agg._avg.rating ? parseFloat(agg._avg.rating.toFixed(1)) : null,
    totalRatings: agg._count.rating,
    userRating,
  };
}

module.exports = { getStores, getStoreById };

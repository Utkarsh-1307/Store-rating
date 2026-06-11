const prisma = require('../prisma');
const { hash } = require('../utils/hashPassword');
const ApiError = require('../utils/ApiError');

const userSelect = {
  id: true,
  name: true,
  email: true,
  address: true,
  role: true,
  createdAt: true,
};

async function getDashboard() {
  const [userCount, storeCount, ratingCount] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  return { totalUsers: userCount, totalStores: storeCount, totalRatings: ratingCount };
}

async function getUsers(search, role) {
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) {
    where.role = role;
  }
  return prisma.user.findMany({
    where: Object.keys(where).length ? where : undefined,
    select: userSelect,
    orderBy: { createdAt: 'desc' },
  });
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...userSelect,
      ratings: {
        select: {
          id: true,
          rating: true,
          createdAt: true,
          store: { select: { id: true, name: true, address: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!user) throw new ApiError(404, 'User not found');

  if (user.role === 'STORE_OWNER') {
    const store = await prisma.store.findFirst({ where: { ownerId: id } });
    if (store) {
      const agg = await prisma.rating.aggregate({
        where: { storeId: store.id },
        _avg: { rating: true },
        _count: { rating: true },
      });
      user.ownedStore = {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: agg._avg.rating ? parseFloat(agg._avg.rating.toFixed(1)) : null,
        totalRatings: agg._count.rating,
      };
    }
  }

  return user;
}

async function createUser(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ApiError(409, 'Email already in use');

  const hashed = await hash(data.password);
  return prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed, role: data.role, address: data.address ?? '' },
    select: userSelect,
  });
}

async function getStores(search) {
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
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { ratings: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const aggregates = await Promise.all(
    stores.map((s) =>
      prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { rating: true } })
    )
  );

  return stores.map((store, i) => ({
    ...store,
    averageRating: aggregates[i]._avg.rating
      ? parseFloat(aggregates[i]._avg.rating.toFixed(1))
      : null,
    totalRatings: store._count.ratings,
  }));
}

async function getStoreById(id) {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      ratings: {
        select: {
          id: true,
          rating: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  if (!store) throw new ApiError(404, 'Store not found');

  const agg = await prisma.rating.aggregate({
    where: { storeId: id },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return {
    ...store,
    averageRating: agg._avg.rating ? parseFloat(agg._avg.rating.toFixed(1)) : null,
    totalRatings: agg._count.rating,
  };
}

async function createStore(data) {
  const owner = await prisma.user.findUnique({ where: { id: data.ownerId } });
  if (!owner) throw new ApiError(404, 'Owner user not found');
  if (owner.role !== 'STORE_OWNER')
    throw new ApiError(400, 'Specified user is not a STORE_OWNER');

  const existing = await prisma.store.findUnique({ where: { email: data.email } });
  if (existing) throw new ApiError(409, 'Store email already in use');

  return prisma.store.create({
    data: { name: data.name, email: data.email, address: data.address, ownerId: data.ownerId },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
}

module.exports = { getDashboard, getUsers, getUserById, createUser, getStores, getStoreById, createStore };

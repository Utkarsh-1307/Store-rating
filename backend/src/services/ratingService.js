const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');

async function submitRating(userId, storeId, value) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) throw new ApiError(404, 'Store not found');

  return prisma.rating.upsert({
    where: { userId_storeId: { userId, storeId } },
    create: { userId, storeId, rating: value },
    update: { rating: value },
    select: { id: true, userId: true, storeId: true, rating: true, createdAt: true, updatedAt: true },
  });
}

async function updateRating(userId, ratingId, value) {
  const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
  if (!rating) throw new ApiError(404, 'Rating not found');
  if (rating.userId !== userId) throw new ApiError(403, 'Not authorized to update this rating');

  return prisma.rating.update({
    where: { id: ratingId },
    data: { rating: value },
    select: { id: true, userId: true, storeId: true, rating: true, createdAt: true, updatedAt: true },
  });
}

async function deleteRating(userId, ratingId) {
  const rating = await prisma.rating.findUnique({ where: { id: ratingId } });
  if (!rating) throw new ApiError(404, 'Rating not found');
  if (rating.userId !== userId) throw new ApiError(403, 'Not authorized to delete this rating');

  await prisma.rating.delete({ where: { id: ratingId } });
}

module.exports = { submitRating, updateRating, deleteRating };

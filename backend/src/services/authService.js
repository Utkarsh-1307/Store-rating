const prisma = require('../prisma');
const { hash, compare } = require('../utils/hashPassword');
const { sign } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
};

async function register(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new ApiError(409, 'Email already in use');

  const hashed = await hash(data.password);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, password: hashed, role: data.role, address: data.address ?? '' },
    select: userSelect,
  });
  return user;
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const valid = await compare(password, user.password);
  if (!valid) throw new ApiError(401, 'Invalid email or password');

  const token = sign({ id: user.id, email: user.email, role: user.role });
  const { password: _, ...safeUser } = user;
  return { token, user: safeUser };
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await compare(currentPassword, user.password);
  if (!valid) throw new ApiError(400, 'Current password is incorrect');

  const hashed = await hash(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
}

module.exports = { register, login, changePassword };

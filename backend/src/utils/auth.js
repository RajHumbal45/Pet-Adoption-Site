import jwt from 'jsonwebtoken';

function getJwtSecret() {
  return process.env.JWT_SECRET || 'change-me';
}

export function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}


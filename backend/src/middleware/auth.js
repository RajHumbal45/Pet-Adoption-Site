import User from '../models/User.js';
import { sanitizeUser, verifyToken } from '../utils/auth.js';

function getBearerToken(headerValue = '') {
  if (!headerValue.startsWith('Bearer ')) {
    return null;
  }

  return headerValue.slice(7);
}

export async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      res.status(401).json({ message: 'Invalid authentication token' });
      return;
    }

    req.user = sanitizeUser(user);
    next();
  } catch (_error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'You do not have access to this resource' });
      return;
    }

    next();
  };
}


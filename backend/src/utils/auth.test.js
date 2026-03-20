import test from 'node:test';
import assert from 'node:assert/strict';
import { createToken, sanitizeUser, verifyToken } from './auth.js';

test('createToken and verifyToken round-trip the user identity', () => {
  process.env.JWT_SECRET = 'test-secret';

  const user = {
    _id: {
      toString() {
        return '507f1f77bcf86cd799439011';
      },
    },
    role: 'admin',
  };

  const token = createToken(user);
  const payload = verifyToken(token);

  assert.equal(payload.sub, '507f1f77bcf86cd799439011');
  assert.equal(payload.role, 'admin');
});

test('sanitizeUser strips password and preserves public fields', () => {
  const user = {
    _id: {
      toString() {
        return '507f1f77bcf86cd799439012';
      },
    },
    name: 'Jane Foster',
    email: 'jane@example.com',
    role: 'user',
    password: 'hidden',
    createdAt: 'now',
    updatedAt: 'later',
  };

  const sanitized = sanitizeUser(user);

  assert.deepEqual(sanitized, {
    id: '507f1f77bcf86cd799439012',
    name: 'Jane Foster',
    email: 'jane@example.com',
    role: 'user',
    createdAt: 'now',
    updatedAt: 'later',
  });
  assert.equal('password' in sanitized, false);
});


import express from 'express';
import User from '../models/User.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createToken, sanitizeUser } from '../utils/auth.js';

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', async (req, res) => {
  const { name, email, password, adminSetupKey } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email, and password are required' });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ message: 'Enter a valid email address' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters long' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409).json({ message: 'An account with this email already exists' });
    return;
  }

  const wantsAdminRole = Boolean(
    adminSetupKey &&
      process.env.ADMIN_SETUP_KEY &&
      adminSetupKey === process.env.ADMIN_SETUP_KEY,
  );

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: wantsAdminRole ? 'admin' : 'user',
  });

  res.status(201).json({
    token: createToken(user),
    user: sanitizeUser(user),
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user || !(await user.comparePassword(password))) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  res.json({
    token: createToken(user),
    user: sanitizeUser(user),
  });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin-check', requireAuth, requireRole('admin'), (req, res) => {
  res.json({
    message: 'Admin access confirmed',
    user: req.user,
  });
});

export default router;


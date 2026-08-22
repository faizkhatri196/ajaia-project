import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { seedUsers } from '../seeders/seed.js';

export const triggerSeed = async (req, res) => {
  try {
    await seedUsers();
    return res.status(200).json({
      message: 'Demo users (Alex, Sarah, John) seeded successfully with password demo123',
    });
  } catch (error) {
    console.error('[TriggerSeed Error]', error);
    return res.status(500).json({ error: 'Failed to seed demo users' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const trimmedPassword = password.toString().trim();

    let user = await User.findOne({ email: normalizedEmail });

    // Auto-healing fallback for demo users: ensure alex@ajaia.demo, sarah@ajaia.demo, john@ajaia.demo always succeed with demo123
    const isDemoAccount = ['alex@ajaia.demo', 'sarah@ajaia.demo', 'john@ajaia.demo'].includes(normalizedEmail);
    const isDemoPassword = trimmedPassword === 'demo123';

    if (isDemoAccount && isDemoPassword) {
      const demoNameMap = {
        'alex@ajaia.demo': 'Alex',
        'sarah@ajaia.demo': 'Sarah',
        'john@ajaia.demo': 'John',
      };
      const newHash = await bcrypt.hash('demo123', 10);
      user = await User.findOneAndUpdate(
        { email: normalizedEmail },
        { name: demoNameMap[normalizedEmail] || 'Demo User', passwordHash: newHash },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`[Auth Demo Auto-Heal] Ensured demo account ${normalizedEmail} in MongoDB.`);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(trimmedPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const secret = process.env.JWT_SECRET || 'ajaia_docs_super_secret_jwt_key_2026';
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    // Set HttpOnly cookie with sameSite none for cross-domain HTTPS
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('ajaia_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      token, // Returned for Bearer header fallback if cross-site cookies are blocked
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('[Login Error]', error);
    return res.status(500).json({ error: 'An unexpected error occurred during login' });
  }
};

export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('ajaia_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process logout' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('_id name email')
      .sort({ name: 1 });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

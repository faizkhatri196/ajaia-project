import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  // Read token from HttpOnly cookie or Authorization header fallback
  let token = req.cookies?.ajaia_token;

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'ajaia_docs_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);

    // Verify user exists in database (handles server/database restarts)
    const userExists = await User.findById(decoded.id).select('_id name email');
    if (!userExists) {
      res.clearCookie('ajaia_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });
      return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    }

    req.user = {
      id: userExists._id,
      name: userExists.name,
      email: userExists.email,
    };

    next();
  } catch (error) {
    res.clearCookie('ajaia_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    return res.status(401).json({ error: 'Authentication required' });
  }
};

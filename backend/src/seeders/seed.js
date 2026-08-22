import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const seedUsers = async () => {
  try {
    console.log('[Seed] Ensuring demo users in database...');
    const defaultPassword = 'demo123';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const demoUsers = [
      {
        name: 'Alex',
        email: 'alex@ajaia.demo',
        passwordHash,
      },
      {
        name: 'Sarah',
        email: 'sarah@ajaia.demo',
        passwordHash,
      },
      {
        name: 'John',
        email: 'john@ajaia.demo',
        passwordHash,
      },
    ];

    for (const user of demoUsers) {
      await User.findOneAndUpdate(
        { email: user.email },
        { name: user.name, passwordHash: user.passwordHash },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('[Seed] Demo users successfully ensured: Alex, Sarah, John (password: demo123).');
  } catch (error) {
    console.error('[Seed Error]', error.message);
  }
};

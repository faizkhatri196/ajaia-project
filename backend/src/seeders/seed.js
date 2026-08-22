import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const seedUsers = async () => {
  try {
    const existingCount = await User.countDocuments();
    if (existingCount > 0) {
      console.log('[Seed] Users already present in database. Skipping seed.');
      return;
    }

    console.log('[Seed] Seeding demo users...');
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

    await User.insertMany(demoUsers);
    console.log('[Seed] Demo users seeded successfully: Alex, Sarah, John.');
  } catch (error) {
    console.error('[Seed Error]', error.message);
  }
};

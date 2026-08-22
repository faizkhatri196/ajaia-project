import mongoose from 'mongoose';
import Share from '../models/Share.js';
import User from '../models/User.js';

export const getShares = async (req, res) => {
  try {
    const { document } = req.docAccess;

    const shareRecords = await Share.find({ document: document._id })
      .populate('user', 'name email')
      .sort({ createdAt: 1 });

    const shares = shareRecords
      .filter((share) => share.user !== null)
      .map((share) => ({
        id: share._id,
        user: share.user,
        permission: share.permission,
        createdAt: share.createdAt,
      }));

    return res.status(200).json({
      owner: document.owner,
      shares,
    });
  } catch (error) {
    console.error('[getShares Error]', error);
    return res.status(500).json({ error: 'Failed to retrieve access list' });
  }
};

export const shareDocument = async (req, res) => {
  try {
    const { document } = req.docAccess;
    const { userId, email } = req.body;

    if (!userId && !email) {
      return res.status(400).json({ error: 'Please specify a user ID or email address to share with' });
    }

    let targetUser = null;

    // Check valid ObjectId
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      targetUser = await User.findById(userId);
    }

    // Fallback to email search if target user not found by ID or if email was passed
    if (!targetUser) {
      const searchEmail = (email || userId || '').toString().toLowerCase().trim();
      if (searchEmail) {
        targetUser = await User.findOne({ email: searchEmail });
      }
    }

    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    const ownerId = document.owner._id ? document.owner._id.toString() : document.owner.toString();
    if (targetUser._id.toString() === ownerId) {
      return res.status(400).json({ error: 'You are already the owner of this document' });
    }

    const shareRecord = await Share.findOneAndUpdate(
      { document: document._id, user: targetUser._id },
      { permission: 'EDITOR' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate('user', 'name email');

    return res.status(200).json({
      message: `Document shared successfully with ${targetUser.name}`,
      share: {
        id: shareRecord._id,
        user: shareRecord.user,
        permission: shareRecord.permission,
      },
    });
  } catch (error) {
    console.error('[shareDocument Error]', error);
    return res.status(500).json({ error: 'Failed to share document' });
  }
};

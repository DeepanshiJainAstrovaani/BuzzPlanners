import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/mongoose';
import Wedding from '../../../models/Wedding';
import mongoose from 'mongoose';

// POST /api/weddings/[id]/sections - Add a new section to a wedding
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const section = req.body;
    section._id = new mongoose.Types.ObjectId();
    const updated = await Wedding.findByIdAndUpdate(
      id,
      { $push: { sections: section } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Wedding not found' });
    return res.status(201).json(section);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to add section', details: error });
  }
}

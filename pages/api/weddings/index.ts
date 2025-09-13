import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../lib/mongoose';
import Wedding from '../models/Wedding';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const weddings = await Wedding.find();
        return res.status(200).json(weddings);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch weddings' });
      }
    case 'POST':
      try {
        const wedding = await Wedding.create(req.body);
        return res.status(201).json(wedding);
      } catch (error) {
        return res.status(400).json({ error: 'Failed to create wedding', details: error });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

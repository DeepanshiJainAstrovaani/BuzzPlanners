/* eslint-disable @typescript-eslint/no-unused-vars  */

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
        // Use the weddingId from the payload if present, otherwise generate one
        let weddingId = req.body.weddingId;
        if (!weddingId) {
          let exists = true;
          while (exists) {
            weddingId = 'WED' + Math.floor(100 + Math.random() * 900);
            exists = !!(await Wedding.exists({ weddingId }));
          }
        }
        const wedding = await Wedding.create({ ...req.body, weddingId });
        return res.status(201).json(wedding.toJSON());
      } catch (error) {
        return res.status(400).json({ error: 'Failed to create wedding', details: error });
      }
    case 'DELETE':
      try {
        const { _id } = req.body;
        if (!_id) return res.status(400).json({ error: 'Wedding _id is required' });
        const deleted = await Wedding.findByIdAndDelete(_id);
        if (!deleted) return res.status(404).json({ error: 'Wedding not found' });
        return res.status(200).json({ success: true });
      } catch (error) {
        return res.status(500).json({ error: 'Failed to delete wedding', details: error });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

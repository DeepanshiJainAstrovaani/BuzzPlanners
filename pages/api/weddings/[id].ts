import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../lib/mongoose';
import Wedding from '../models/Wedding';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const {
    query: { id },
    method,
    body
  } = req;

  switch (method) {
    case 'GET':
      try {
        console.log('[GET /api/weddings/[id]] params:', id);
        const wedding = await Wedding.findById(id);
        if (!wedding) return res.status(404).json({ error: 'Wedding not found' });
        return res.status(200).json(wedding.toJSON());
      } catch (error) {
        return res.status(400).json({ error: 'Failed to fetch wedding', details: error });
      }
    case 'PUT':
      try {
        console.log('[PUT /api/weddings/[id]] params:', id);
        const updatedWedding = await Wedding.findByIdAndUpdate(id, body, { new: true });
        if (!updatedWedding) return res.status(404).json({ error: 'Wedding not found' });
        return res.status(200).json(updatedWedding.toJSON());
      } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Failed to update wedding', details: error });
      }
    case 'DELETE':
      try {
        console.log('[DELETE /api/weddings/[id]] params:', id);
        const deletedWedding = await Wedding.findByIdAndDelete(id);
        if (!deletedWedding) return res.status(404).json({ error: 'Wedding not found' });
        return res.status(200).json({ message: 'Wedding deleted' });
      } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Failed to delete wedding', details: error });
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

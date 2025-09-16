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

  // Here `id` in the route actually refers to the Mongo _id. For operations by weddingId, we could expose another route if needed.
  switch (method) {
    case 'PUT':
      try {
        console.log('[PUT /api/weddings/[id]] params:', id);
        const updatedWedding = await Wedding.findByIdAndUpdate(id as string, body, { new: true });
        if (!updatedWedding) return res.status(404).json({ error: 'Wedding not found' });
        return res.status(200).json(updatedWedding.toJSON());
      } catch (error) {
        console.error('[PUT /api/weddings/[id]] Error:', error);
        return res.status(400).json({ error: 'Failed to update wedding', details: error });
      }
    case 'DELETE':
      try {
        console.log('[DELETE /api/weddings/[id]] params:', id);
        const deletedWedding = await Wedding.findByIdAndDelete(id as string);
        if (!deletedWedding) return res.status(404).json({ error: 'Wedding not found' });
        return res.status(200).json({ message: 'Wedding deleted' });
      } catch (error) {
        console.error('[DELETE /api/weddings/[id]] Error:', error);
        return res.status(400).json({ error: 'Failed to delete wedding', details: error });
      }
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

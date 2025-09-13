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
    case 'PUT':
      try {
        const updatedWedding = await Wedding.findOneAndUpdate({ id }, body, { new: true });
        if (!updatedWedding) return res.status(404).json({ error: 'Wedding not found' });
        return res.status(200).json(updatedWedding);
      } catch (error) {
        return res.status(400).json({ error: 'Failed to update wedding', details: error });
      }
    case 'DELETE':
      try {
        const deletedWedding = await Wedding.findOneAndDelete({ id });
        if (!deletedWedding) return res.status(404).json({ error: 'Wedding not found' });
        return res.status(200).json({ message: 'Wedding deleted' });
      } catch (error) {
        return res.status(400).json({ error: 'Failed to delete wedding', details: error });
      }
    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

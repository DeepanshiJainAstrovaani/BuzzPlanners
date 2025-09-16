import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../lib/mongoose';
import Wedding from '../models/Wedding';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const weddings = await Wedding.find();
        const json = weddings.map((w: any) => w.toJSON());
        console.log('[GET /api/weddings] count:', json.length);
        return res.status(200).json(json);
      } catch (error) {
        console.error('[GET /api/weddings] Error fetching weddings:', error);
        return res.status(500).json({ error: 'Failed to fetch weddings', details: error });
      }
    case 'POST':
      try {
        // Generate a unique weddingId: WED + 3 random digits, never repeated
        let weddingId = req.body?.weddingId;
        let attempts = 0;
        if (!weddingId) {
          let exists = true;
          while (exists) {
            attempts++;
            weddingId = 'WED' + Math.floor(100 + Math.random() * 900);
            exists = !!(await Wedding.exists({ weddingId }));
          }
        }
        console.log('[POST /api/weddings] Using weddingId:', weddingId, 'attempts:', attempts, 'payload keys:', Object.keys(req.body || {}));
        const wedding = await Wedding.create({ ...req.body, weddingId });
        const json = wedding.toJSON();
        console.log('[POST /api/weddings] Created wedding:', { _id: json._id, weddingId: json.weddingId, title: json.title });
        return res.status(201).json(json);
      } catch (error) {
        console.error('[POST /api/weddings] Error creating wedding:', error);
        return res.status(400).json({ error: 'Failed to create wedding', details: error });
      }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

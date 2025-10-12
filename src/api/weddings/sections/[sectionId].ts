import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../lib/mongoose';
import Wedding from '../../models/Wedding';

// GET, PUT, DELETE /api/weddings/[id]/sections/[sectionId]
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id, sectionId } = req.query;

  switch (req.method) {
    case 'GET': {
      // Get a single section
      const wedding = await Wedding.findById(id);
      if (!wedding) return res.status(404).json({ error: 'Wedding not found' });
      const section = wedding.sections.id(sectionId);
      if (!section) return res.status(404).json({ error: 'Section not found' });
      return res.status(200).json(section);
    }
    case 'PUT': {
      // Update a section
      const wedding = await Wedding.findById(id);
      if (!wedding) return res.status(404).json({ error: 'Wedding not found' });
      const section = wedding.sections.id(sectionId);
      if (!section) return res.status(404).json({ error: 'Section not found' });
      Object.assign(section, req.body);
      await wedding.save();
      return res.status(200).json(section);
    }
    case 'DELETE': {
      // Delete a section
      const wedding = await Wedding.findById(id);
      if (!wedding) return res.status(404).json({ error: 'Wedding not found' });
      const section = wedding.sections.id(sectionId);
      if (!section) return res.status(404).json({ error: 'Section not found' });
      section.remove();
      await wedding.save();
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

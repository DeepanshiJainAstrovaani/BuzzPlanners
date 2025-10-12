/* eslint-disable @typescript-eslint/no-unused-vars  */

import mongoose, { Schema, Document, models, model, Types } from 'mongoose';

export interface ISectionRow {
  [key: string]: any;
}

export interface IColumnMeta {
  id: string;
  name: string;
}

export interface ISection {
  _id: Types.ObjectId;
  key: string;
  label: string;
  type: string; // e.g. 'table', 'form', etc.
  columns: string[];
  rows: ISectionRow[];
  // New fields for stable columns
  columnsMeta?: IColumnMeta[];
  rowsByColId?: Record<string, string>[];
}

export interface IWedding extends Document {
  weddingId: string;
  title: string;
  date: string;
  venue: string;
  contactPersonGroomSide: string;
  contactPersonBrideSide: string;
  mobileGroomSide: string;
  mobileBrideSide: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  sections: ISection[];
}

const SectionRowSchema = new Schema<ISectionRow>({}, { strict: false, _id: false });

const ColumnMetaSchema = new Schema<IColumnMeta>({
  id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

const RowsByColIdSchema = new Schema<Record<string, string>>({}, { strict: false, _id: false });

const SectionSchema = new Schema<ISection>({
  key: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  columns: { type: [String], required: true },
  rows: { type: [SectionRowSchema], default: [] },
  // Persist stable column metadata and id-mapped rows
  columnsMeta: { type: [ColumnMetaSchema], default: undefined },
  rowsByColId: { type: [RowsByColIdSchema], default: undefined },
}, { _id: true });

const WeddingSchema = new Schema<IWedding>({
  weddingId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true },
  contactPersonGroomSide: { type: String, required: true },
  contactPersonBrideSide: { type: String, required: true },
  mobileGroomSide: { type: String, required: true },
  mobileBrideSide: { type: String, required: true },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], required: true },
  sections: { type: [SectionSchema], default: [] },
});

WeddingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.weddingId = doc.weddingId;
    return ret;
  }
});

export default models.Wedding || model<IWedding>('Wedding', WeddingSchema);

import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IVendorMasterSheetRow {
  item: string;
  status: 'Booked' | 'Pending';
  advance: number;
  cost: number;
  pending: number;
  vendor: string;
  vendorContact: string;
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
  vendorMasterSheet: IVendorMasterSheetRow[];
  brideSide?: any[];
  groomSide?: any[];
  makeupArtist?: any[];
  performanceLineups?: any[];
}

const VendorMasterSheetRowSchema = new Schema<IVendorMasterSheetRow>({
  item: { type: String, required: true },
  status: { type: String, enum: ['Booked', 'Pending'], required: true },
  advance: { type: Number, required: true },
  cost: { type: Number, required: true },
  pending: { type: Number, required: true },
  vendor: { type: String, required: true },
  vendorContact: { type: String, required: true },
});

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
  vendorMasterSheet: { type: [VendorMasterSheetRowSchema], default: [] },
  brideSide: { type: Array, default: [] },
  groomSide: { type: Array, default: [] },
  makeupArtist: { type: Array, default: [] },
  performanceLineups: { type: Array, default: [] },
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

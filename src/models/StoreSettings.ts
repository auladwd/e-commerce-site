import mongoose, { Schema, Document } from "mongoose";

export interface IStoreSettings extends Document {
  storeName: string;
  storeNameBn: string;
  hotline: string;
  whatsapp: string;
  email: string;
  address: string;
  shippingFeeInsideDhaka: number;
  shippingFeeOutsideDhaka: number;
  bkashNumber: string;
  nagadNumber: string;
  currencySymbol: string;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, default: "SmartShop BD" },
    storeNameBn: { type: String, default: "স্মার্টশপ বাংলাদেশ" },
    hotline: { type: String, default: "01700000000" },
    whatsapp: { type: String, default: "8801700000000" },
    email: { type: String, default: "support@smartshopbd.com" },
    address: { type: String, default: "Mirpur-10, Dhaka-1216, Bangladesh" },
    shippingFeeInsideDhaka: { type: Number, default: 70 },
    shippingFeeOutsideDhaka: { type: Number, default: 130 },
    bkashNumber: { type: String, default: "01700000000" },
    nagadNumber: { type: String, default: "01700000000" },
    currencySymbol: { type: String, default: "৳" },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.StoreSettings as mongoose.Model<IStoreSettings>) ||
  mongoose.model<IStoreSettings>("StoreSettings", StoreSettingsSchema);

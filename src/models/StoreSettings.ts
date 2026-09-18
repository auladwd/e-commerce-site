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
  couponEnabled: boolean;
  couponCode: string;
  couponDiscountType: "percentage" | "fixed";
  couponDiscountValue: number;
  couponMinOrder: number;
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
    couponEnabled: { type: Boolean, default: false },
    couponCode: { type: String, default: "SAVE10" },
    couponDiscountType: { type: String, default: "percentage" },
    couponDiscountValue: { type: Number, default: 10 },
    couponMinOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.StoreSettings as mongoose.Model<IStoreSettings>) ||
  mongoose.model<IStoreSettings>("StoreSettings", StoreSettingsSchema);

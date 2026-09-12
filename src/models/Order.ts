import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  title: string;
  titleBn?: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

export interface ITrackingEvent {
  status: string;
  note: string;
  timestamp: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: string;
  userEmail?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryZone: "dhaka" | "outside";
  notes?: string;
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: "cod" | "bkash" | "nagad" | "rocket";
  paymentStatus: "pending" | "paid" | "failed";
  trxId?: string;
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  trackingHistory: ITrackingEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    titleBn: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    color: { type: String },
    size: { type: String },
  },
  { _id: false }
);

const TrackingEventSchema = new Schema<ITrackingEvent>(
  {
    status: { type: String, required: true },
    note: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    userEmail: { type: String, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true, index: true },
    customerAddress: { type: String, required: true },
    deliveryZone: { type: String, enum: ["dhaka", "outside"], default: "dhaka" },
    notes: { type: String },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "bkash", "nagad", "rocket"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    trxId: { type: String },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    trackingHistory: { type: [TrackingEventSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);

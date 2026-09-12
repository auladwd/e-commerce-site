import mongoose, { Schema, Document } from "mongoose";

export interface IProductImage {
  url: string;
  public_id?: string;
  optimized_url?: string;
  thumbnail_url?: string;
}

export interface IProduct extends Document {
  title: string;
  titleBn: string;
  slug: string;
  price: number;
  salePrice?: number;
  description: string;
  descriptionBn: string;
  category: string;
  categoryBn: string;
  images: IProductImage[];
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isFlashDeal: boolean;
  colors?: string[];
  sizes?: string[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    public_id: { type: String },
    optimized_url: { type: String },
    thumbnail_url: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    titleBn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    description: { type: String, required: true },
    descriptionBn: { type: String, required: true },
    category: { type: String, required: true, index: true },
    categoryBn: { type: String, required: true },
    images: { type: [ProductImageSchema], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isFlashDeal: { type: Boolean, default: false },
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);

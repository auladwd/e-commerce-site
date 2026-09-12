import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  nameBn: string;
  slug: string;
  image?: string;
  icon?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    nameBn: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    icon: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

export default (mongoose.models.Category as mongoose.Model<ICategory>) ||
  mongoose.model<ICategory>("Category", CategorySchema);

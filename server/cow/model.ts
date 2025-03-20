import { model, Schema, Document, Types } from "mongoose";
import { ABSENCE, ORIGIN, SEX } from "../consts";

export interface Cow extends Document {
  longCode: string;
  shortCode: string;
  breed: Types.ObjectId;
  sex: SEX;
  birthDate: string | null;
  weight: string | null;
  origin: ORIGIN;
  buyPrice: number | null;
  salePrice: number | null;
  absence: ABSENCE | null;
  characteristics: Types.ObjectId[];
  father: Types.ObjectId | null;
  mother: Types.ObjectId | null;
  children: Types.ObjectId[];
}
const cowSchema = new Schema<Cow>(
  {
    longCode: { type: String, required: true },
    shortCode: { type: String, required: true },
    breed: { type: Schema.ObjectId, ref: "CowBreed", required: true },
    sex: { type: String, required: true },
    birthDate: { type: String, default: null },
    weight: { type: String, default: null },
    origin: { type: String, required: true },
    buyPrice: { type: Number, default: null },
    salePrice: { type: Number, default: null },
    absence: { type: String, default: null },
    characteristics: [{ type: Schema.ObjectId, ref: "CowCharacteristic" }],
    father: { type: Schema.ObjectId, ref: "Cow", default: null },
    mother: { type: Schema.ObjectId, ref: "Cow", default: null },
    children: [{ type: Schema.ObjectId, ref: "Cow" }],
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);
const CowModel = model<Cow>("Cow", cowSchema);

export interface CowBreed extends Document {
  value: string;
}
const cowBreedSchema = new Schema<CowBreed>(
  {
    value: { type: String, required: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);
export const CowBreedModel = model<CowBreed>("CowBreed", cowBreedSchema);

export interface CowCharacteristic extends Document {
  value: string;
}
const CowCharacteristicSchema = new Schema<CowCharacteristic>(
  {
    value: { type: String, required: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);
export const CowCharacteristicModel = model<CowCharacteristic>(
  "CowCharacteristic",
  CowCharacteristicSchema
);

export default CowModel;

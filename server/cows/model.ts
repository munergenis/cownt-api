import { model, Schema, Document } from "mongoose";

export interface Cow extends Document {
  name: string;
  age: number;
}

const cowSchema = new Schema<Cow>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
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

export default CowModel;

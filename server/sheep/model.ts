import { model, Schema, Document } from "mongoose";

export interface Sheep extends Document {
  name: string;
  age: number;
}

const sheepSchema = new Schema<Sheep>(
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

const SheepModel = model<Sheep>("Sheep", sheepSchema);

export default SheepModel;

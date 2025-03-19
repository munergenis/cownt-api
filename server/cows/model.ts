import { model, Schema } from "mongoose";

interface Cow {
  name: string;
  age: number;
}

const cowSchema = new Schema<Cow>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

const CowModel = model<Cow>("Cow", cowSchema);

export default CowModel;

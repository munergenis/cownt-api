import CowModel, { Cow } from "./model";
import {
  CreateCowSchema,
  createCowSchema,
  UpdateCowSchema,
} from "./validation/schemas";

const service = {
  async getAllCows() {
    const allCows: Cow[] = await CowModel.find({});
    return allCows;
  },

  async getCowById(cowId: string) {
    const cow: Cow | null = await CowModel.findById(cowId);
    return cow;
  },

  async createCow(cowData: CreateCowSchema) {
    // TODO: Validar que la vaca amb aquest codi no existeixi
    // const cowExists: Cow | null = await CowModel.findOne({
    //   CODI_X_O_PROPIETAT: cowData.CODI_X_O_PROPIETAT,
    // });
    // if (cowExists) {
    //   return null;
    // }
    const newCowDocument: Cow = await CowModel.create(cowData);
    return newCowDocument;
  },

  async deleteCow(cowId: string) {
    const deletedCow: Cow | null = await CowModel.findByIdAndDelete(cowId);
    return deletedCow;
  },

  async updateCow(cowId: string, cowData: UpdateCowSchema) {
    const updatedCow: Cow | null = await CowModel.findByIdAndUpdate(
      cowId,
      cowData,
      {
        returnDocument: "after",
      }
    );
    return updatedCow;
  },
};

export default service;

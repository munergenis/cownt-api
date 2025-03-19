import SheepModel, { Sheep } from "./model";
import {
  CreateSheepSchema,
  createSheepSchema,
  UpdateSheepSchema,
} from "./validation/schemas";

const service = {
  async getAllSheeps() {
    const allSheeps: Sheep[] = await SheepModel.find({});
    return allSheeps;
  },

  async getSheepById(sheepId: string) {
    const sheep: Sheep | null = await SheepModel.findById(sheepId);
    return sheep;
  },

  async createSheep(sheepData: CreateSheepSchema) {
    // TODO: Validar que la vaca amb aquest codi no existeixi
    // const sheepExists: Sheep | null = await SheepModel.findOne({
    //   CODI_X_O_PROPIETAT: sheepData.CODI_X_O_PROPIETAT,
    // });
    // if (sheepExists) {
    //   return null;
    // }
    const newSheepDocument: Sheep = await SheepModel.create(sheepData);
    return newSheepDocument;
  },

  async deleteSheep(sheepId: string) {
    const deletedSheep: Sheep | null = await SheepModel.findByIdAndDelete(
      sheepId
    );
    return deletedSheep;
  },

  async updateSheep(sheepId: string, sheepData: UpdateSheepSchema) {
    const updatedSheep: Sheep | null = await SheepModel.findByIdAndUpdate(
      sheepId,
      sheepData,
      {
        returnDocument: "after",
      }
    );
    return updatedSheep;
  },
};

export default service;

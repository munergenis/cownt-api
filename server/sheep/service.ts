import {
  CreateSheepSchema,
  UpdateSheepSchema,
  createSheepSchema,
} from './validation/schemas';
import SheepModel, { Sheep } from './model';

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
        returnDocument: 'after',
      }
    );
    return updatedSheep;
  },
};

export default service;

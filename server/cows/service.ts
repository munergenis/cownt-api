import CowModel from "./model";
import { CowClientData } from "./validation/schemas";

const service = {
  async getAllCows() {
    const allCows = await CowModel.find({});
    return allCows;
  },

  async getCowById(cowId) {
    const cow = await CowModel.findById(cowId);
    return cow;
  },

  async createCow(cowData) {
    const newCow = {
      name: cowData.name,
      age: cowData.age,
    };
    const newCowDocument = await CowModel.create(newCow);
    return newCowDocument;
  },

  async deleteCow(cowId) {
    await CowModel.findByIdAndDelete(cowId);
  },

  async updateCow(cowId, cowData) {
    const updatedCow = await CowModel.findByIdAndUpdate(cowId, cowData, {
      returnDocument: "after",
    });
    return updatedCow;
  },
};

export default service;

import mongoose, { mongo } from "mongoose";
import { COW_SHORT_CODE_LAST_CHARS_NUM } from "../consts";
import CowModel, {
  Cow,
  CowBreed,
  CowBreedModel,
  CowCharacteristic,
  CowCharacteristicModel,
} from "./model";
import {
  CreateBreedSchema,
  CreateCharacteristicSchema,
  CreateCowSchema,
  UpdateBreedSchema,
  UpdateCharacteristicSchema,
  UpdateCowSchema,
} from "./validation/schemas";

const service = {
  // Cow methods
  async getAllCows() {
    const allCows: Cow[] = await CowModel.find({});
    return allCows;
  },

  async getCowById(cowId: string) {
    const cow: Cow | null = await CowModel.findById(cowId);
    return cow;
  },

  async createCow(cowData: CreateCowSchema) {
    const { longCode } = cowData;
    const shortCode = longCode.slice(-COW_SHORT_CODE_LAST_CHARS_NUM);

    const newcow = { ...cowData, shortCode };

    const newCowDocument: Cow = await CowModel.create(newcow);
    return newCowDocument;
  },

  async deleteCow(cowId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedCow: Cow | null = await CowModel.findByIdAndDelete(cowId);

      if (!deletedCow) {
        await session.abortTransaction();
        await session.endSession();
        return null;
      }

      // actualitzar vaques
      await CowModel.updateMany({ father: cowId }, { $set: { father: null } });
      await CowModel.updateMany({ mother: cowId }, { $set: { mother: null } });
      await CowModel.updateMany(
        { children: cowId },
        { $pull: { children: cowId } }
      );

      await session.commitTransaction();
      await session.endSession();
      return deletedCow;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  },

  async updateCow(cowId: string, cowData: UpdateCowSchema) {
    const shortCode = cowData.longCode?.slice(-COW_SHORT_CODE_LAST_CHARS_NUM);
    const updatedCowData = {
      ...cowData,
      ...(shortCode && { shortCode }),
    };

    const updatedCow: Cow | null = await CowModel.findByIdAndUpdate(
      cowId,
      updatedCowData,
      { returnDocument: "after" }
    );
    return updatedCow;
  },

  // Breed methods
  async getAllBreeds() {
    const breeds: CowBreed[] = await CowBreedModel.find({});
    return breeds;
  },

  async createBreed(breedData: CreateBreedSchema) {
    const newBreed: CowBreed = await CowBreedModel.create(breedData);
    return newBreed;
  },

  async deleteBreed(breedId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedBreed = await CowBreedModel.findByIdAndDelete(
        breedId
      ).session(session);
      if (!deletedBreed) {
        // If breed is not found, abort transaction and return null
        await session.abortTransaction();
        await session.endSession();
        return null;
      }

      // updates every cow with deleted breed
      await CowModel.updateMany(
        { breed: breedId },
        { $set: { breed: null } }
      ).session(session);

      // confims transaction
      await session.commitTransaction();
      await session.endSession();
      return deletedBreed;
    } catch (error) {
      // if error, abort transaction and propagate error
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  },

  async updateBreed(breedId: string, breedData: UpdateBreedSchema) {
    const updatedBreed: CowBreed | null = await CowBreedModel.findByIdAndUpdate(
      breedId,
      breedData,
      { returnDocument: "after" }
    );
    return updatedBreed;
  },

  // Characteristic methods
  async getAllCharacteristics() {
    const characteristics: CowCharacteristic[] =
      await CowCharacteristicModel.find({});
    return characteristics;
  },

  async createCharacteristic(characteristicData: CreateCharacteristicSchema) {
    const newCharacteristic: CowCharacteristic =
      await CowCharacteristicModel.create(characteristicData);
    return newCharacteristic;
  },

  async deleteCharacteristic(characteristicId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedCharacteristic: CowCharacteristic | null =
        await CowCharacteristicModel.findByIdAndDelete(characteristicId);
      if (!deletedCharacteristic) {
        await session.abortTransaction();
        await session.endSession();
        return null;
      }

      // find cows which have deletedCharacteristic in characteristics array and delete this characteristic from this array
      await CowModel.updateMany(
        { characteristics: characteristicId },
        { $pull: { characteristics: characteristicId } }
      ).session(session);

      await session.commitTransaction();
      await session.endSession();
      return deletedCharacteristic;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  },

  async updateCharacteristic(
    characteristicId: string,
    characteristicData: UpdateCharacteristicSchema
  ) {
    const updatedCharacteristic: CowCharacteristic | null =
      await CowCharacteristicModel.findByIdAndUpdate(
        characteristicId,
        characteristicData,
        { returnDocument: "after" }
      );
    return updatedCharacteristic;
  },
};

export default service;

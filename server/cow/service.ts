import mongoose, { mongo } from "mongoose";
import { COW_SHORT_CODE_LAST_CHARS_NUM, ORIGIN } from "../consts";
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
    const cow: Cow | null = await CowModel.findById(cowId).populate([
      "breed",
      "characteristics",
      "father",
      "mother",
      "children",
    ]);
    return cow;
  },

  async createCow(cowData: CreateCowSchema) {
    const { longCode } = cowData;
    const shortCode = longCode.slice(-COW_SHORT_CODE_LAST_CHARS_NUM);

    const newCow = { ...cowData, shortCode };
    let createdCow: Cow;

    /**
     * Animal could be bought or born
     * - if animal is born, mother must be passed
     * - if animal is bought mother must not be passed
     *
     * if mother is passed, the child (current animal) must be added to it's children arrays
     */
    if (!newCow.mother && newCow.origin === ORIGIN.BOUGHT) {
      // if none is passed the animal we only create the animal document
      createdCow = await CowModel.create(newCow);
    } else if (newCow.mother && newCow.origin === ORIGIN.BORN) {
      // both are passed so must update father and mother documents
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        createdCow = await CowModel.create([newCow], { session })[0];

        // updating mother births
        await CowModel.updateMany(
          { _id: newCow.mother },
          { $push: { children: createdCow._id } }
        ).session(session);
        // TODO: update mother birthAverage

        await session.commitTransaction();
        await session.endSession();
      } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
      }
    } else {
      throw new Error("Internal server error");
    }

    return createdCow;
  },

  async deleteCow(cowId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const deletedCow: Cow | null = await CowModel.findByIdAndDelete(
        cowId
      ).session(session);

      if (!deletedCow) {
        await session.abortTransaction();
        await session.endSession();
        return null;
      }

      if (!deletedCow.mother) {
        await session.commitTransaction();
        await session.endSession();
        return deletedCow;
      }

      // set mother prop to null on all children
      await CowModel.updateMany(
        { mother: cowId },
        { $set: { mother: null } }
      ).session(session);
      // delete from children array of the mother
      await CowModel.updateMany(
        { children: cowId },
        { $pull: { children: cowId } }
      ).session(session);
      // TODO: update birthAverage from mother (mothers?)

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
    const updatedCow: Cow | null = await CowModel.findByIdAndUpdate(
      cowId,
      cowData,
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
        await CowCharacteristicModel.findByIdAndDelete(
          characteristicId
        ).session(session);
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

import { Request, Response } from "express";
import cowService from "./service";
import {
  CreateBreedSchema,
  createBreedSchema,
  createCharacteristicSchema,
  CreateCharacteristicSchema,
  CreateCowSchema,
  createCowSchema,
  UpdateBreedSchema,
  updateBreedSchema,
  updateCharacteristicSchema,
  UpdateCharacteristicSchema,
  UpdateCowSchema,
  updateCowSchema,
} from "./validation/schemas";
import { ZodError } from "zod";
import { Cow, CowBreed, CowCharacteristic } from "./model";
import { Types } from "mongoose";

const controller = {
  // Cow methods
  async getAllCows(req: Request, res: Response) {
    try {
      const allCows: Cow[] = await cowService.getAllCows();
      res.status(200).json(allCows);
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database error" });
      return;
    }
  },

  async getCowById(req: Request, res: Response) {
    const { cowId } = req.params;
    if (!Types.ObjectId.isValid(cowId)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    let cow: Cow | null;

    try {
      cow = await cowService.getCowById(cowId);

      if (!cow) {
        res.status(404).json({ message: `Cow with id ${cowId} not found` });
        return;
      }

      res.status(200).json(cow);
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database connection error" });
      return;
    }
  },

  async createCow(req: Request, res: Response) {
    let cowData: CreateCowSchema;
    let newCow: Cow;

    // validate payload
    try {
      cowData = await createCowSchema.parseAsync(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.issues);
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      return;
    }

    try {
      newCow = await cowService.createCow(cowData);
      res.status(201).json(newCow);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  async deleteCow(req: Request, res: Response) {
    const { cowId } = req.params;
    if (!Types.ObjectId.isValid(cowId)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    try {
      const deletedCow = await cowService.deleteCow(cowId);
      if (!deletedCow) {
        res
          .status(404)
          .json({ message: `Cow with id ${cowId} does not exist` });
        return;
      }

      res
        .status(200)
        .json({ message: `Cow with id ${cowId} deleted successfully` });
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database connection error" });
      return;
    }
  },

  async updateCow(req: Request, res: Response) {
    const { cowId } = req.params;
    if (!Types.ObjectId.isValid(cowId)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    let cowData: UpdateCowSchema;
    let updatedCow: Cow | null;

    // validate payload
    try {
      cowData = await updateCowSchema.parseAsync(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.issues);
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      return;
    }

    try {
      updatedCow = await cowService.updateCow(cowId, cowData);

      if (!updatedCow) {
        res
          .status(404)
          .json({ message: `Cow with id ${cowId} does not exist` });
        return;
      }

      res.status(200).json(updatedCow);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  // Breed methods
  async getAllBreeds(req: Request, res: Response) {
    try {
      const allBreeds = await cowService.getAllBreeds();
      res.status(200).json(allBreeds);
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database error" });
      return;
    }
  },

  async createBreed(req: Request, res: Response) {
    let breedData: CreateBreedSchema;
    let newBreed: CowBreed;

    try {
      breedData = await createBreedSchema.parseAsync(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.issues);
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      return;
    }

    try {
      newBreed = await cowService.createBreed(breedData);
      res.status(200).json(newBreed);
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  async deleteBreed(req: Request, res: Response) {
    const { breedId } = req.params;
    if (!Types.ObjectId.isValid(breedId)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    try {
      const deletedBreed = await cowService.deleteBreed(breedId);
      if (!deletedBreed) {
        res.status(404).json({ message: "Breed not found" });
        return;
      }

      res
        .status(200)
        .json({ message: `Breed with id ${breedId} deleted successfully` });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  async updateBreed(req: Request, res: Response) {
    const { breedId } = req.params;
    if (!Types.ObjectId.isValid(breedId)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    let breedData: UpdateBreedSchema;
    let updatedBreed: CowBreed | null;

    try {
      breedData = await updateBreedSchema.parseAsync(req.body);
      if (Object.entries(breedData).length === 0) {
        res.status(400).json({ message: "No valid data found" });
        return;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.issues);
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      return;
    }

    try {
      updatedBreed = await cowService.updateBreed(breedId, breedData);

      if (!updatedBreed) {
        res.status(404).json({ message: "Breed not found" });
        return;
      }

      res.status(200).json(updatedBreed);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  // Characteristic methods
  async getAllCharacteristics(req: Request, res: Response) {
    try {
      const allCharacteristics = await cowService.getAllCharacteristics();
      res.status(200).json(allCharacteristics);
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database error" });
      return;
    }
  },

  async createCharacteristic(req: Request, res: Response) {
    let characteristicData: CreateCharacteristicSchema;
    let newCharacteristic: CowCharacteristic;

    try {
      characteristicData = await createCharacteristicSchema.parseAsync(
        req.body
      );
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.issues);
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      return;
    }

    try {
      newCharacteristic = await cowService.createCharacteristic(
        characteristicData
      );
      res.status(200).json(newCharacteristic);
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  async deleteCharacteristic(req: Request, res: Response) {
    const { characteristicId } = req.params;
    if (!Types.ObjectId.isValid(characteristicId)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    try {
      const deletedCharacteristic = await cowService.deleteCharacteristic(
        characteristicId
      );
      if (!deletedCharacteristic) {
        res.status(404).json({ message: "Characteristic not found" });
        return;
      }

      res.status(200).json({
        message: `Characteristic with id ${characteristicId} deleted successfully`,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  async updateCharacteristic(req: Request, res: Response) {
    const { characteristicId } = req.params;
    if (!Types.ObjectId.isValid(characteristicId)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    let characteristicData: UpdateCharacteristicSchema;
    let updatedCharacteristic: CowCharacteristic | null;

    try {
      characteristicData = await updateCharacteristicSchema.parseAsync(
        req.body
      );
      if (Object.entries(characteristicData).length === 0) {
        res.status(400).json({ message: "No valid data found" });
        return;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error.issues);
      } else {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      return;
    }

    try {
      updatedCharacteristic = await cowService.updateCharacteristic(
        characteristicId,
        characteristicData
      );

      if (!updatedCharacteristic) {
        res.status(404).json({ message: "Characteristic not found" });
        return;
      }

      res.status(200).json(updatedCharacteristic);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },
};

export default controller;

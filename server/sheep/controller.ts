import { Request, Response } from "express";
import sheepService from "./service";
import {
  CreateSheepSchema,
  createSheepSchema,
  UpdateSheepSchema,
  updateSheepSchema,
} from "./validation/schemas";
import { ZodError } from "zod";
import { Sheep } from "./model";

const controller = {
  async getAllSheeps(req: Request, res: Response) {
    try {
      const allSheeps: Sheep[] = await sheepService.getAllSheeps();
      res.status(200).json(allSheeps);
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database error" });
      return;
    }
  },

  async getSheepById(req: Request, res: Response) {
    const { sheepId } = req.params;
    let sheep: Sheep | null;

    try {
      sheep = await sheepService.getSheepById(sheepId);

      if (!sheep) {
        res.status(404).json({ message: `Sheep with id ${sheepId} not found` });
        return;
      }

      res.status(200).json(sheep);
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database connection error" });
      return;
    }
  },

  async createSheep(req: Request, res: Response) {
    let sheepData: CreateSheepSchema;
    let newSheep: Sheep | null;

    // validate payload
    try {
      sheepData = createSheepSchema.parse(req.body);
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
      newSheep = await sheepService.createSheep(sheepData);

      if (!newSheep) {
        res.status(409).json({ message: "Sheep already exists" });
        return;
      }

      res.status(201).json(newSheep);
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database connection error" });
      return;
    }
  },

  async deleteSheep(req: Request, res: Response) {
    const { sheepId } = req.params;
    try {
      const deletedSheep = await sheepService.deleteSheep(sheepId);

      if (!deletedSheep) {
        res
          .status(404)
          .json({ message: `Sheep with id ${sheepId} does not exist` });
        return;
      }

      res
        .status(200)
        .json({ message: `Sheep with id ${sheepId} deleted successfully` });
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database connection error" });
      return;
    }
  },

  async updateSheep(req: Request, res: Response) {
    const { sheepId } = req.params;
    let sheepData: UpdateSheepSchema;
    let updatedSheep: Sheep | null;

    try {
      sheepData = updateSheepSchema.parse(req.body);
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
      updatedSheep = await sheepService.updateSheep(sheepId, sheepData);

      if (!updatedSheep) {
        res
          .status(404)
          .json({ message: `Sheep with id ${sheepId} does not exist` });
        return;
      }

      res.status(200).json(updatedSheep);
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database connection error" });
      return;
    }
  },
};

export default controller;

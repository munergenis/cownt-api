import { Request, Response } from "express";
import cowService from "./service";
import {
  CreateCowSchema,
  createCowSchema,
  UpdateCowSchema,
  updateCowSchema,
} from "./validation/schemas";
import { ZodError } from "zod";
import { Cow } from "./model";

const controller = {
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
    let newCow: Cow | null;

    // validate payload
    try {
      cowData = createCowSchema.parse(req.body);
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

      if (!newCow) {
        res.status(409).json({ message: "Cow already exists" });
        return;
      }

      res.status(201).json(newCow);
      return;
    } catch (error) {
      console.error(error);
      res.status(503).json({ message: "Database connection error" });
      return;
    }
  },

  async deleteCow(req: Request, res: Response) {
    const { cowId } = req.params;
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
    let cowData: UpdateCowSchema;
    let updatedCow: Cow | null;

    try {
      cowData = updateCowSchema.parse(req.body);
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
      res.status(503).json({ message: "Database connection error" });
      return;
    }
  },
};

export default controller;

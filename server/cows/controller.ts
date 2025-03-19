import { Request, Response } from "express";
import cowService from "./service";
import { CowClientData } from "./validation/schemas";
import { ZodError } from "zod";
import mongoose, { MongooseError } from "mongoose";

const controller = {
  async getAllCows(req: Request, res: Response) {
    const allCows = await cowService.getAllCows();
    res.status(200).json(allCows);
  },

  async getCowById(req: Request, res: Response) {
    const { cowId } = req.params;
    const cow = await cowService.getCowById(cowId);
    res.status(200).json(cow);
  },

  async createCow(req: Request, res: Response) {
    let cowData;
    let newCow;

    try {
      cowData = CowClientData.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(error);
      } else {
        res.status(500).json(error);
      }
      return;
    }

    try {
      newCow = await cowService.createCow(cowData);
    } catch (error) {
      let status = 500;
      let response = {
        message: "An unexpected error occurred",
        details: error.message,
      };

      if (error instanceof mongoose.Error.ValidationError) {
        status = 400;
        response = {
          message: "Validation error",
          details: error.errors,
        };
      } else if (error instanceof mongoose.Error || error.code === 11000) {
        status = 409;
        response = {
          message: "Duplicate key error",
          details: error.keyValue,
        };
      } else if (error instanceof mongoose.Error) {
        status = 503;
        response = {
          message: "Database connection error",
          details: error.message,
        };
      }

      res.status(status).json(response);
      return;
    }

    res.status(201).json(newCow);
  },

  async deleteCow(req: Request, res: Response) {
    const { cowId } = req.params;
    await cowService.deleteCow(cowId);
    res.status(200).json();
  },

  async updateCow(req: Request, res: Response) {
    const { cowId } = req.params;
    const cowData = CowClientData.parse(req.body);
    const updatedCow = await cowService.updateCow(cowId, cowData);
    res.status(200).json(updatedCow);
  },
};

export default controller;

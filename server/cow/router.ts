import { Router } from "express";
import cowController from "./controller";

const router = Router();

router.get("/", cowController.getAllCows);
router.get("/:cowId", cowController.getCowById);

router.post("/", cowController.createCow);
router.patch("/:cowId", cowController.updateCow);
router.delete("/:cowId", cowController.deleteCow);

export default router;

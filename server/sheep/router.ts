import { Router } from "express";
import sheepController from "./controller";

const router = Router();

router.get("/", sheepController.getAllSheeps);
router.get("/:sheepId", sheepController.getSheepById);

router.post("/", sheepController.createSheep);
router.patch("/:sheepId", sheepController.updateSheep);
router.delete("/:sheepId", sheepController.deleteSheep);

export default router;

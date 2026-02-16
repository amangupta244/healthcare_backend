import express from "express";
import { createDoctor, getDoctors, updateDoctor, deleteDoctor, getDoctorById } from "../controllers/doctorController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
const router = express.Router();


router.post(
  "/create",
  protect,
  authorize("admin"),
  createDoctor
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateDoctor
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteDoctor
);

router.get("/:id", getDoctorById);
router.get("/", getDoctors);


export default router;
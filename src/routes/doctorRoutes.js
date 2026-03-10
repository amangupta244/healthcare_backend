import express from "express";
import { createDoctor, getDoctors, updateDoctor, deleteDoctor, getDoctorById } from "../controllers/doctorController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { validate, doctorCreateRules, doctorUpdateRules, idParamRules } from '../middleware/validators.js';
const router = express.Router();


router.post(
  "/create",
  protect,
  authorize("admin"),
  validate(doctorCreateRules),
  createDoctor
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  validate(doctorUpdateRules),
  updateDoctor
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validate(idParamRules),
  deleteDoctor
);

router.get("/:id", validate(idParamRules), getDoctorById);
router.get("/", getDoctors);


export default router;
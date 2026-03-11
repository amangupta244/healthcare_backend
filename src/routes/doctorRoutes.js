import express from "express";
import {
    createDoctor,
    getDoctors,
    updateDoctor,
    deleteDoctor,
    getDoctorById,
    getDoctorProfile,
    getDoctorPatients
} from "../controllers/doctorController.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import { validate, doctorCreateRules, doctorUpdateRules, idParamRules } from '../middleware/validators.js';
const router = express.Router();

// Admin: create doctor
router.post(
    "/create",
    protect,
    authorize("admin"),
    validate(doctorCreateRules),
    createDoctor
);

// Admin: update doctor
router.put(
    "/:id",
    protect,
    authorize("admin"),
    validate(doctorUpdateRules),
    updateDoctor
);

// Admin: delete doctor
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    validate(idParamRules),
    deleteDoctor
);

// Doctor: view own profile
router.get("/profile", protect, authorize("doctor"), getDoctorProfile);

// Doctor/Admin: list patients who booked with a specific doctor
router.get(
    "/:id/patients",
    protect,
    authorize("doctor", "admin"),
    validate(idParamRules),
    getDoctorPatients
);

// Public: list and get doctor by ID
router.get("/:id", validate(idParamRules), getDoctorById);
router.get("/", getDoctors);

export default router;

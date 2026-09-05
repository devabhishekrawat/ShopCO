import express from "express";
import { auth, authByUserRole } from "../../middleware/authMiddleware.js";
import {
    createCoupon,
    getAllCoupons,
    validateCoupon,
    deleteCoupon
} from "../controller/coupon.controller.js";

const router = express.Router();

router.post("/validate", auth, validateCoupon);

router.post("/", auth, authByUserRole("admin"), createCoupon);
router.get("/", auth, authByUserRole("admin"), getAllCoupons);
router.delete("/:id", auth, authByUserRole("admin"), deleteCoupon);

export default router;

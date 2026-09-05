import express from "express";
import { auth, authByUserRole } from "../../middleware/authMiddleware.js";
import {
    getDashboardStats,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getAllUsers,
    updateUserRole
} from "../controller/admin.controller.js";

const router = express.Router();

router.use(auth, authByUserRole("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", updateOrderStatus);
router.get("/users", getAllUsers);
router.patch("/user/:id", updateUserRole);

export default router;

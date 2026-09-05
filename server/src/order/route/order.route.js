import express from "express";
import { auth, authByUserRole } from "../../middleware/authMiddleware.js";
import {
    checkout,
    getMyOrders,
    getOrderById,
    getAllOrdersAdmin,
    getOrderByIdAdmin,
    updateOrderStatusAdmin
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/checkout", auth, checkout);
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderById);

router.get("/admin/all", auth, authByUserRole("admin"), getAllOrdersAdmin);
router.get("/admin/:id", auth, authByUserRole("admin"), getOrderByIdAdmin);
router.patch("/admin/:id/status", auth, authByUserRole("admin"), updateOrderStatusAdmin);

export default router;

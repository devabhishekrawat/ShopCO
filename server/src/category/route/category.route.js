import express from "express";
import { auth, authByUserRole } from "../../middleware/authMiddleware.js";
import {
    getAllCategories,
    getCategoryById,
    getProductsByCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controller/category.controller.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getProductsByCategory);

router.post("/", auth, authByUserRole("admin"), createCategory);
router.patch("/:id", auth, authByUserRole("admin"), updateCategory);
router.put("/:id", auth, authByUserRole("admin"), updateCategory);
router.delete("/:id", auth, authByUserRole("admin"), deleteCategory);

export default router;

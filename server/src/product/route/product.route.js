import express from "express";
import { auth, authByUserRole } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/uploadMiddleware.js";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductQuantity
} from "../controller/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", auth, authByUserRole("admin"), upload.array("images", 5), createProduct);
router.patch("/:id", auth, authByUserRole("admin"), upload.array("images", 5), updateProduct);
router.put("/:id", auth, authByUserRole("admin"), upload.array("images", 5), updateProduct);
router.delete("/:id", auth, authByUserRole("admin"), deleteProduct);
router.patch("/:id/quantity", auth, authByUserRole("admin"), updateProductQuantity);

export default router;

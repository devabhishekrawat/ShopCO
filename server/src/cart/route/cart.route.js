import express from "express";
import { auth } from "../../middleware/authMiddleware.js";
import {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
} from "../controller/cart.controller.js";

const router = express.Router();

router.use(auth);

router.get("/", getCart);
router.post("/", addToCart);
router.patch("/:productId", updateCartItemQuantity);
router.put("/:productId", updateCartItemQuantity);
router.delete("/:productId", removeCartItem);
router.delete("/", clearCart);

export default router;


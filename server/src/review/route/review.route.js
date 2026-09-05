import express from "express";
import { auth } from "../../middleware/authMiddleware.js";
import {
    getProductReviews,
    createReview,
    updateReview,
    deleteReview
} from "../controller/review.controller.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);

router.post("/", auth, createReview);
router.patch("/:id", auth, updateReview);
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

export default router;


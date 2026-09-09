import Review from "../model/review.model.js";
import Product from "../../product/model/product.model.js";
import User from "../../user/model/user.modal.js";
import Order from "../../order/model/order.model.js";
import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";

export const getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({})
            .populate("user", "name")
            .populate("product", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalReviews: reviews.length,
            reviews
        });
    } catch (error) {
        return next(error);
    }
};

export const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId })
            .populate("user", "name profileImg")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalReviews: reviews.length,
            reviews
        });
    } catch (error) {
        return next(error);
    }
};

export const createReview = async (req, res, next) => {
    try {
        const { product, productId, rating, comment } = req.body;
        const targetProductId = product || productId;

        if (!targetProductId) {
            return next(new ErrorHandler(400, "Product ID is required"));
        }

        const ratingNumber = Number(rating);
        if (!rating || ratingNumber < 1 || ratingNumber > 5) {
            return next(new ErrorHandler(400, "Rating must be an integer between 1 and 5"));
        }

        const productExists = await Product.findById(targetProductId);
        if (!productExists) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        const hasPurchased = await Order.findOne({
            user: req.user._id,
            "products.product": targetProductId
        });

        if (!hasPurchased) {
            return next(
                new ErrorHandler(400, "You can only review products that you have purchased")
            );
        }

        const existingReview = await Review.findOne({
            user: req.user._id,
            product: targetProductId
        });

        if (existingReview) {
            return next(new ErrorHandler(400, "You have already reviewed this product"));
        }

        const review = await Review.create({
            user: req.user._id,
            product: targetProductId,
            rating: ratingNumber,
            comment: comment || ""
        });

        res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review
        });
    } catch (error) {
        return next(error);
    }
};

export const updateReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return next(new ErrorHandler(404, "Review not found"));
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler(403, "You can only edit your own review"));
        }

        if (rating !== undefined) {
            const ratingNumber = Number(rating);
            if (ratingNumber < 1 || ratingNumber > 5) {
                return next(new ErrorHandler(400, "Rating must be between 1 and 5"));
            }
            review.rating = ratingNumber;
        }

        if (comment !== undefined) {
            review.comment = comment;
        }

        await review.save();

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            review
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return next(new ErrorHandler(404, "Review not found"));
        }

        if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return next(new ErrorHandler(403, "Access denied. Cannot delete this review"));
        }

        await Review.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        return next(error);
    }
};


import Coupon from "../model/coupon.model.js";
import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";

export const createCoupon = async (req, res, next) => {
    try {
        const { code, discountType, discountValue, expiryDate } = req.body;

        if (!code || !discountType || discountValue === undefined || !expiryDate) {
            return next(new ErrorHandler(400, "Please provide all coupon fields"));
        }

        if (!["percentage", "fixed"].includes(discountType)) {
            return next(new ErrorHandler(400, "Discount type must be percentage or fixed"));
        }

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
        if (existingCoupon) {
            return next(new ErrorHandler(400, "Coupon code already exists"));
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase().trim(),
            discountType,
            discountValue: Number(discountValue),
            expiryDate: new Date(expiryDate)
        });

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find({});
        res.status(200).json({
            success: true,
            coupons
        });
    } catch (error) {
        return next(error);
    }
};

export const validateCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;

        if (!code) {
            return next(new ErrorHandler(400, "Please provide coupon code"));
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase().trim(),
            isActive: true
        });

        if (!coupon) {
            return next(new ErrorHandler(404, "Invalid coupon code"));
        }

        if (new Date() > new Date(coupon.expiryDate)) {
            return next(new ErrorHandler(400, "Coupon code has expired"));
        }

        res.status(200).json({
            success: true,
            message: "Coupon is valid",
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                expiryDate: coupon.expiryDate
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return next(new ErrorHandler(404, "Coupon not found"));
        }

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        });
    } catch (error) {
        return next(error);
    }
};


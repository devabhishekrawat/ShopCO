import Product from "../../product/model/product.model.js";
import Category from "../../category/model/category.model.js";
import userModel from "../../user/model/user.schema.js";
import Order from "../../order/model/order.model.js";
import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";

export const getDashboardStats = async (req, res, next) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalUsers = await userModel.countDocuments();
        const totalOrders = await Order.countDocuments();
        const outOfStockProducts = await Product.countDocuments({ quantity: 0 });
        const lowStockProducts = await Product.countDocuments({
            quantity: { $gt: 0, $lte: 5 }
        });
        const inStockProducts = await Product.countDocuments({
            quantity: { $gt: 5 }
        });

        res.status(200).json({
            success: true,
            dashboard: {
                totalProducts,
                totalCategories,
                totalUsers,
                totalOrders,
                outOfStockProducts,
                lowStockProducts,
                inStockProducts
            }
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("products.product", "name images price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders
        });
    } catch (error) {
        return next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("products.product", "name images price");

        if (!order) {
            return next(new ErrorHandler(404, "Order not found"));
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered"];

        if (!status || !validStatuses.includes(status)) {
            return next(
                new ErrorHandler(
                    400,
                    `Invalid status value. Must be one of: ${validStatuses.join(", ")}`
                )
            );
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return next(new ErrorHandler(404, "Order not found"));
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find({});
        res.status(200).json({
            success: true,
            totalUsers: users.length,
            users
        });
    } catch (error) {
        return next(error);
    }
};

export const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;

        if (!role || !["user", "admin"].includes(role)) {
            return next(new ErrorHandler(400, "Role must be either user or admin"));
        }

        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return next(new ErrorHandler(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user
        });
    } catch (error) {
        return next(error);
    }
};


import Order from "../model/order.model.js";
import Cart from "../../cart/model/cart.model.js";
import Product from "../../product/model/product.model.js";
import Coupon from "../../coupon/model/coupon.model.js";
import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";

export const checkout = async (req, res, next) => {
    try {
        const { shippingInfo, couponCode } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart || cart.products.length === 0) {
            return next(new ErrorHandler(400, "Your cart is empty"));
        }

        const orderProducts = [];
        let subtotal = 0;
        const productsToUpdate = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return next(new ErrorHandler(404, "One or more products in your cart no longer exist"));
            }

            const itemSize = item.size ? String(item.size).trim() : "";

            if (product.sizes && product.sizes.length > 0) {
                if (!itemSize) {
                    return next(
                        new ErrorHandler(400, `Size is required for product "${product.name}"`)
                    );
                }
                const sizeItem = product.sizes.find((s) => s.size === itemSize);
                if (!sizeItem) {
                    return next(
                        new ErrorHandler(
                            400,
                            `Size "${itemSize}" is no longer available for product "${product.name}"`
                        )
                    );
                }
                if (sizeItem.quantity < item.quantity) {
                    return next(
                        new ErrorHandler(
                            400,
                            `Insufficient stock for "${product.name}" (Size: ${itemSize}). Available: ${sizeItem.quantity}, requested: ${item.quantity}`
                        )
                    );
                }
            } else {
                if (product.quantity < item.quantity) {
                    return next(
                        new ErrorHandler(
                            400,
                            `Insufficient stock for product: ${product.name}. Available: ${product.quantity}, requested: ${item.quantity}`
                        )
                    );
                }
            }

            const itemDiscount = product.discount || 0;
            const effectivePrice = itemDiscount > 0
                ? Number((product.price - (product.price * itemDiscount) / 100).toFixed(2))
                : product.price;

            orderProducts.push({
                product: product._id,
                quantity: item.quantity,
                price: effectivePrice,
                size: itemSize
            });

            subtotal += effectivePrice * item.quantity;
            productsToUpdate.push({
                productId: product._id,
                size: itemSize,
                quantity: item.quantity
            });
        }

        subtotal = Number(subtotal.toFixed(2));

        let couponDiscount = 0;
        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode.toUpperCase().trim(),
                isActive: true
            });

            if (!coupon) {
                return next(new ErrorHandler(400, "Invalid coupon code"));
            }

            if (new Date() > new Date(coupon.expiryDate)) {
                return next(new ErrorHandler(400, "Coupon has expired"));
            }

            if (coupon.discountType === "percentage") {
                couponDiscount = (subtotal * coupon.discountValue) / 100;
            } else if (coupon.discountType === "fixed") {
                couponDiscount = coupon.discountValue;
            }

            couponDiscount = Math.min(couponDiscount, subtotal);
            couponDiscount = Number(couponDiscount.toFixed(2));
        }

        const total = Number(Math.max(0, subtotal - couponDiscount).toFixed(2));

        const finalShippingInfo = shippingInfo || {
            street: req.user.address?.street || "",
            city: req.user.address?.city || "",
            state: req.user.address?.state || "",
            postalCode: req.user.address?.postalCode || "",
            country: req.user.address?.country || "",
            phone: req.user.phone || ""
        };

        const order = await Order.create({
            user: req.user._id,
            products: orderProducts,
            subtotal,
            discount: couponDiscount,
            total,
            shippingInfo: finalShippingInfo,
            status: "Pending"
        });

        for (const item of productsToUpdate) {
            if (item.size) {
                await Product.updateOne(
                    { _id: item.productId, "sizes.size": item.size },
                    { $inc: { "sizes.$.quantity": -item.quantity, quantity: -item.quantity } }
                );
            } else {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { quantity: -item.quantity } }
                );
            }
            const updatedProd = await Product.findById(item.productId);
            if (updatedProd) {
                const totalStock = updatedProd.sizes && updatedProd.sizes.length > 0
                    ? updatedProd.sizes.reduce((sum, s) => sum + s.quantity, 0)
                    : updatedProd.quantity;
                updatedProd.quantity = totalStock;
                updatedProd.status = totalStock === 0 ? "OUT_OF_STOCK" : "IN_STOCK";
                await updatedProd.save();
            }
        }

        cart.products = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        return next(error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("products.product", "name images price discount")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("products.product", "name images price discount");

        if (!order) {
            return next(new ErrorHandler(404, "Order not found"));
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return next(new ErrorHandler(403, "Access denied. You can only view your own orders"));
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllOrdersAdmin = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("products.product", "name images price discount")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        return next(error);
    }
};

export const getOrderByIdAdmin = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("products.product", "name images price discount");

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

export const updateOrderStatusAdmin = async (req, res, next) => {
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

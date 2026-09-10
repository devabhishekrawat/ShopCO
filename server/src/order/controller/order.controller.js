import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";
import mongoose from "mongoose";
import {
    createOrderRepo,
    findUserOrdersRepo,
    findOrderByIdRepo,
    findAllOrdersRepo,
    findOrderByIdAdminRepo,
    updateOrderStatusRepo,
    findCartByUserIdRepo,
    clearCartRepo,
    findProductByIdForOrderRepo,
    findActiveCouponRepo,
    decrementStockRepo,
    updateInventoryAfterOrderRepo
} from "../model/order.repository.js";



export const checkout = async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
        const { shippingInfo, couponCode } = req.body;
        let order;

        await session.withTransaction(async () => {
            const cart = await findCartByUserIdRepo(req.user._id, session);
            if (!cart || cart.products.length === 0) {
                throw new ErrorHandler(400, "Your cart is empty");
            }

            const orderProducts = [];
            let subtotal = 0;

            for (const item of cart.products) {
                const product = await findProductByIdForOrderRepo(item.product, session);
                if (!product) {
                    throw new ErrorHandler(404, "One or more products in your cart no longer exist");
                }

                const itemSize = item.size ? String(item.size).trim() : "";

                if (product.sizes && product.sizes.length > 0) {
                    if (!itemSize) {
                        throw new ErrorHandler(400, `Size is required for product "${product.name}"`);
                    }
                    const sizeItem = product.sizes.find((s) => s.size === itemSize);
                    if (!sizeItem) {
                        throw new ErrorHandler(
                            400,
                            `Size "${itemSize}" is no longer available for product "${product.name}"`
                        );
                    }
                    if (sizeItem.quantity < item.quantity) {
                        throw new ErrorHandler(
                            400,
                            `Insufficient stock for "${product.name}" (Size: ${itemSize}). Available: ${sizeItem.quantity}, requested: ${item.quantity}`
                        );
                    }
                } else {
                    if (product.quantity < item.quantity) {
                        throw new ErrorHandler(
                            400,
                            `Insufficient stock for product: ${product.name}. Available: ${product.quantity}, requested: ${item.quantity}`
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

                const decremented = await decrementStockRepo(
                    { productId: product._id, size: itemSize, quantity: item.quantity },
                    session
                );
                if (!decremented) {
                    throw new ErrorHandler(
                        400,
                        `Insufficient stock for "${product.name}"${itemSize ? ` (Size: ${itemSize})` : ""}. Another order may have just used the remaining stock.`
                    );
                }
            }

            subtotal = Number(subtotal.toFixed(2));

            let couponDiscount = 0;
            if (couponCode) {
                const coupon = await findActiveCouponRepo(couponCode, session);

                if (!coupon) {
                    throw new ErrorHandler(400, "Invalid coupon code");
                }
                if (new Date() > new Date(coupon.expiryDate)) {
                    throw new ErrorHandler(400, "Coupon has expired");
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

            order = await createOrderRepo({
                user: req.user._id,
                products: orderProducts,
                subtotal,
                discount: couponDiscount,
                total,
                shippingInfo: finalShippingInfo,
                status: "Pending"
            }, session);

            await clearCartRepo(cart, session);
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        return next(error);
    } finally {
        await session.endSession();
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await findUserOrdersRepo(req.user._id);

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
        const order = await findOrderByIdRepo(req.params.id);

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
        const orders = await findAllOrdersRepo();

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
        const order = await findOrderByIdAdminRepo(req.params.id);

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

        const order = await updateOrderStatusRepo(req.params.id, status);

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

import Cart from "../model/cart.model.js";
import Product from "../../product/model/product.model.js";
import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";

export const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate("products.product");
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, products: [] });
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        return next(error);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1, size } = req.body;
        const requestedQuantity = Number(quantity);

        if (!productId) {
            return next(new ErrorHandler(400, "Product ID is required"));
        }

        if (requestedQuantity <= 0) {
            return next(new ErrorHandler(400, "Quantity must be greater than 0"));
        }

        const product = await Product.findById(productId).populate("category");
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        const trimmedSize = size ? String(size).trim() : "";
        let availableStock = 0;

        if (product.sizes && product.sizes.length > 0) {
            if (!trimmedSize) {
                return next(new ErrorHandler(400, "Please select a size for this product"));
            }

            const allowedCategorySizes = product.category?.sizes || [];
            if (allowedCategorySizes.length > 0 && !allowedCategorySizes.includes(trimmedSize)) {
                return next(
                    new ErrorHandler(
                        400,
                        `Size "${trimmedSize}" is not valid for category "${product.category?.name}"`
                    )
                );
            }

            const sizeItem = product.sizes.find((s) => s.size === trimmedSize);
            if (!sizeItem) {
                return next(
                    new ErrorHandler(
                        400,
                        `Size "${trimmedSize}" is not available for this product`
                    )
                );
            }

            if (sizeItem.quantity <= 0) {
                return next(new ErrorHandler(400, `Size "${trimmedSize}" is out of stock`));
            }

            availableStock = sizeItem.quantity;
        } else {
            availableStock = product.quantity;
            if (availableStock <= 0 || product.status === "OUT_OF_STOCK") {
                return next(new ErrorHandler(400, "Product is out of stock"));
            }
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, products: [] });
        }

        const existingItem = cart.products.find(
            (item) =>
                item.product.toString() === productId &&
                (item.size || "") === trimmedSize
        );

        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        const totalRequestedQuantity = currentCartQuantity + requestedQuantity;

        if (totalRequestedQuantity > availableStock) {
            return next(
                new ErrorHandler(
                    400,
                    `Cannot add quantity. Available stock is ${availableStock}, you already have ${currentCartQuantity} in cart`
                )
            );
        }

        if (existingItem) {
            existingItem.quantity = totalRequestedQuantity;
        } else {
            cart.products.push({
                product: productId,
                quantity: requestedQuantity,
                size: trimmedSize
            });
        }

        await cart.save();
        await cart.populate("products.product");

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        });
    } catch (error) {
        return next(error);
    }
};

export const updateCartItemQuantity = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity, size, itemId } = req.body;
        const newQuantity = Number(quantity);
        const trimmedSize = size !== undefined ? String(size).trim() : undefined;

        if (quantity === undefined || newQuantity < 1) {
            return next(new ErrorHandler(400, "Quantity must be at least 1"));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new ErrorHandler(404, "Cart not found"));
        }

        let cartItem;
        if (itemId) {
            cartItem = cart.products.id(itemId);
        }
        if (!cartItem) {
            cartItem = cart.products.find((item) => {
                if (item.product.toString() !== productId) return false;
                if (trimmedSize !== undefined) {
                    return (item.size || "") === trimmedSize;
                }
                return true;
            });
        }

        if (!cartItem) {
            return next(new ErrorHandler(404, "Product item not found in cart"));
        }

        const itemSize = cartItem.size || "";
        let availableStock = product.quantity;
        if (itemSize && product.sizes && product.sizes.length > 0) {
            const sizeObj = product.sizes.find((s) => s.size === itemSize);
            if (sizeObj) {
                availableStock = sizeObj.quantity;
            }
        }

        if (newQuantity > availableStock) {
            return next(
                new ErrorHandler(
                    400,
                    `Requested quantity exceeds available stock of ${availableStock}`
                )
            );
        }

        cartItem.quantity = newQuantity;
        await cart.save();
        await cart.populate("products.product");

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });
    } catch (error) {
        return next(error);
    }
};

export const removeCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { size, itemId } = { ...req.query, ...req.body };
        const trimmedSize = size !== undefined ? String(size).trim() : undefined;

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new ErrorHandler(404, "Cart not found"));
        }

        if (itemId) {
            cart.products = cart.products.filter(
                (item) => item._id.toString() !== itemId
            );
        } else if (trimmedSize !== undefined) {
            cart.products = cart.products.filter(
                (item) =>
                    !(item.product.toString() === productId && (item.size || "") === trimmedSize)
            );
        } else {
            cart.products = cart.products.filter(
                (item) => item.product.toString() !== productId
            );
        }

        await cart.save();
        await cart.populate("products.product");

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart
        });
    } catch (error) {
        return next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.products = [];
            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully"
        });
    } catch (error) {
        return next(error);
    }
};


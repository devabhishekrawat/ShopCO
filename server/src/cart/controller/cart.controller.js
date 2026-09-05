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
        const { productId, quantity = 1 } = req.body;
        const requestedQuantity = Number(quantity);

        if (!productId) {
            return next(new ErrorHandler(400, "Product ID is required"));
        }

        if (requestedQuantity <= 0) {
            return next(new ErrorHandler(400, "Quantity must be greater than 0"));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        if (product.quantity <= 0 || product.status === "OUT_OF_STOCK") {
            return next(new ErrorHandler(400, "Product is out of stock"));
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, products: [] });
        }

        const existingItem = cart.products.find(
            (item) => item.product.toString() === productId
        );

        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        const totalRequestedQuantity = currentCartQuantity + requestedQuantity;

        if (totalRequestedQuantity > product.quantity) {
            return next(
                new ErrorHandler(
                    400,
                    `Cannot add quantity. Available stock is ${product.quantity}, you already have ${currentCartQuantity} in cart`
                )
            );
        }

        if (existingItem) {
            existingItem.quantity = totalRequestedQuantity;
        } else {
            cart.products.push({
                product: productId,
                quantity: requestedQuantity
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
        const { quantity } = req.body;
        const newQuantity = Number(quantity);

        if (quantity === undefined || newQuantity < 1) {
            return next(new ErrorHandler(400, "Quantity must be at least 1"));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        if (newQuantity > product.quantity) {
            return next(
                new ErrorHandler(
                    400,
                    `Requested quantity exceeds available stock of ${product.quantity}`
                )
            );
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return next(new ErrorHandler(404, "Cart not found"));
        }

        const cartItem = cart.products.find(
            (item) => item.product.toString() === productId
        );

        if (!cartItem) {
            return next(new ErrorHandler(404, "Product not found in cart"));
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
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return next(new ErrorHandler(404, "Cart not found"));
        }

        cart.products = cart.products.filter(
            (item) => item.product.toString() !== productId
        );

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


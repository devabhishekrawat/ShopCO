import Product from "../model/product.model.js";
import { Category } from "../../category/model/category.model.js";
import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";
import {
    findProductsRepo,
    countProductsRepo,
    findProductByIdRepo,
    createProductRepo,
    updateProductRepo,
    deleteProductRepo
} from "../model/product.repository.js";

export const getAllProducts = async (req, res, next) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            availability,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined && minPrice !== "") {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice !== undefined && maxPrice !== "") {
                query.price.$lte = Number(maxPrice);
            }
        }

        if (availability !== undefined && availability !== "") {
            if (availability === "true" || availability === true) {
                query.quantity = { $gt: 0 };
            } else if (availability === "false" || availability === false) {
                query.quantity = 0;
            }
        }

        let sortOptions = { createdAt: -1 };
        if (sort === "price_asc") {
            sortOptions = { price: 1 };
        } else if (sort === "price_desc") {
            sortOptions = { price: -1 };
        } else if (sort === "newest") {
            sortOptions = { createdAt: -1 };
        } else if (sort === "name") {
            sortOptions = { name: 1 };
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 10);
        const skip = (pageNum - 1) * limitNum;

        const totalProducts = await countProductsRepo(query);
        const totalPages = Math.ceil(totalProducts / limitNum);
        const products = await findProductsRepo(query, sortOptions, skip, limitNum);

        res.status(200).json({
            success: true,
            products,
            currentPage: pageNum,
            totalPages,
            totalProducts
        });
    } catch (error) {
        return next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await findProductByIdRepo(req.params.id);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"));
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, discount, category, quantity } = req.body;

        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map((file) => `/assets/${file.filename}`);
        } else if (req.file) {
            images = [`/assets/${req.file.filename}`];
        } else if (req.body.images) {
            images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        }

        if (!name || !description || price === undefined || !category || quantity === undefined) {
            return next(new ErrorHandler(400, "Please provide all required fields"));
        }

        if (images.length === 0) {
            return next(new ErrorHandler(400, "Please provide at least one product image"));
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return next(new ErrorHandler(404, "Category not found"));
        }

        const product = await createProductRepo({
            name,
            description,
            price: Number(price),
            discount: discount !== undefined ? Number(discount) : 0,
            images,
            category,
            quantity: Number(quantity),
            status: Number(quantity) === 0 ? "OUT_OF_STOCK" : "IN_STOCK"
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        return next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        if (req.body.category) {
            const categoryExists = await Category.findById(req.body.category);
            if (!categoryExists) {
                return next(new ErrorHandler(404, "Category not found"));
            }
        }

        const updateData = { ...req.body };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map((file) => `/assets/${file.filename}`);
        } else if (req.file) {
            updateData.images = [`/assets/${req.file.filename}`];
        }

        if (updateData.price !== undefined) {
            updateData.price = Number(updateData.price);
        }

        if (updateData.discount !== undefined) {
            updateData.discount = Number(updateData.discount);
        }

        if (updateData.quantity !== undefined) {
            updateData.quantity = Number(updateData.quantity);
            updateData.status = updateData.quantity === 0 ? "OUT_OF_STOCK" : "IN_STOCK";
        }

        const product = await updateProductRepo(req.params.id, updateData);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await deleteProductRepo(req.params.id);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        return next(error);
    }
};

export const updateProductQuantity = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        if (quantity === undefined || Number(quantity) < 0) {
            return next(new ErrorHandler(400, "Please provide a valid non-negative quantity"));
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        product.quantity = Number(quantity);
        product.status = Number(quantity) === 0 ? "OUT_OF_STOCK" : "IN_STOCK";
        await product.save();

        res.status(200).json({
            success: true,
            message: "Product quantity updated successfully",
            product
        });
    } catch (error) {
        return next(error);
    }
};

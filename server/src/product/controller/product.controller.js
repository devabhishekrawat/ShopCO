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
            stock,
            sort,
            page = 1,
            limit = 10,
            size,
            dressStyle
        } = req.query;

        const query = {};

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        if (size) {
            query["sizes.size"] = { $regex: new RegExp(`^${size}$`, "i") };
        }

        if (dressStyle) {
            const styleRegex = { $regex: dressStyle, $options: "i" };
            if (query.name) {
                query.$and = [
                    { name: query.name },
                    { $or: [{ name: styleRegex }, { description: styleRegex }] }
                ];
                delete query.name;
            } else {
                query.$or = [{ name: styleRegex }, { description: styleRegex }];
            }
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

        const rawStock = stock || availability;
        if (rawStock !== undefined && rawStock !== "") {
            const stockVal = rawStock.toString().toLowerCase().trim();
            if (stockVal === "in_stock" || stockVal === "in-stock" || stockVal === "instock" || stockVal === "in stock") {
                query.quantity = { $gt: 5 };
            } else if (stockVal === "low_stock" || stockVal === "low-stock" || stockVal === "lowstock" || stockVal === "low stock") {
                query.quantity = { $gt: 0, $lte: 5 };
            } else if (stockVal === "out_of_stock" || stockVal === "out-of-stock" || stockVal === "outofstock" || stockVal === "out of stock" || stockVal === "false") {
                query.quantity = 0;
            } else if (stockVal === "true") {
                query.quantity = { $gt: 0 };
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

const validateProductSizes = (sizes, categoryDoc) => {
    let parsedSizes = [];
    if (typeof sizes === "string") {
        try {
            parsedSizes = JSON.parse(sizes);
        } catch {
            return { error: "Invalid sizes format" };
        }
    } else if (Array.isArray(sizes)) {
        parsedSizes = sizes;
    } else if (!sizes) {
        parsedSizes = [];
    } else {
        return { error: "Invalid sizes format" };
    }

    const categorySizes = categoryDoc.sizes || [];

    if (categorySizes.length === 0) {
        return { validSizes: [] };
    }

    if (parsedSizes.length === 0) {
        return { error: `Sizes are required for category "${categoryDoc.name}". Allowed sizes: ${categorySizes.join(", ")}` };
    }

    const seenSizes = new Set();
    const cleanSizes = [];

    for (const item of parsedSizes) {
        if (!item || !item.size || typeof item.size !== "string") {
            return { error: "Each size entry must specify a size name" };
        }
        const trimmedSize = item.size.trim();
        if (!categorySizes.includes(trimmedSize)) {
            return { error: `Size "${trimmedSize}" is not allowed for category "${categoryDoc.name}". Allowed: ${categorySizes.join(", ")}` };
        }
        if (seenSizes.has(trimmedSize)) {
            return { error: `Duplicate size "${trimmedSize}" found in product inventory` };
        }
        seenSizes.add(trimmedSize);

        const qty = Number(item.quantity);
        if (isNaN(qty) || qty < 0) {
            return { error: `Quantity for size "${trimmedSize}" must be a non-negative number` };
        }
        cleanSizes.push({ size: trimmedSize, quantity: Math.floor(qty) });
    }

    return { validSizes: cleanSizes };
};

export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, discount, category, sizes, quantity } = req.body;

        let images = [];
        if (req.files && req.files.length > 0) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            const hasOversized = req.files.some((file) => file.size > MAX_FILE_SIZE);
            if (hasOversized) {
                return next(new ErrorHandler(400, "Each image must be less than 5MB"));
            }
            images = req.files.map((file) => `/assets/${file.filename}`);
        } else if (req.file) {
            if (req.file.size > 5 * 1024 * 1024) {
                return next(new ErrorHandler(400, "Image must be less than 5MB"));
            }
            images = [`/assets/${req.file.filename}`];
        } else if (req.body.images) {
            images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        }

        if (!name || !description || price === undefined || !category) {
            return next(new ErrorHandler(400, "Please provide all required fields"));
        }

        if (images.length === 0) {
            return next(new ErrorHandler(400, "Please provide at least one product image"));
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return next(new ErrorHandler(404, "Category not found"));
        }

        const sizeValidation = validateProductSizes(sizes, categoryExists);
        if (sizeValidation.error) {
            return next(new ErrorHandler(400, sizeValidation.error));
        }

        const validSizes = sizeValidation.validSizes;
        const totalQuantity = validSizes.length > 0
            ? validSizes.reduce((sum, s) => sum + s.quantity, 0)
            : (Number(quantity) || 0);

        const product = await createProductRepo({
            name,
            description,
            price: Number(price),
            discount: discount !== undefined ? Number(discount) : 0,
            images,
            category,
            sizes: validSizes,
            quantity: totalQuantity,
            status: totalQuantity === 0 ? "OUT_OF_STOCK" : "IN_STOCK"
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
        const existingProduct = await Product.findById(req.params.id);
        if (!existingProduct) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        const targetCategoryId = req.body.category || existingProduct.category;
        const categoryDoc = await Category.findById(targetCategoryId);
        if (!categoryDoc) {
            return next(new ErrorHandler(404, "Category not found"));
        }

        const updateData = { ...req.body };

        if (req.files && req.files.length > 0) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            const hasOversized = req.files.some((file) => file.size > MAX_FILE_SIZE);
            if (hasOversized) {
                return next(new ErrorHandler(400, "Each image must be less than 5MB"));
            }
            updateData.images = req.files.map((file) => `/assets/${file.filename}`);
        } else if (req.file) {
            if (req.file.size > 5 * 1024 * 1024) {
                return next(new ErrorHandler(400, "Image must be less than 5MB"));
            }
            updateData.images = [`/assets/${req.file.filename}`];
        }

        if (updateData.price !== undefined) {
            updateData.price = Number(updateData.price);
        }

        if (updateData.discount !== undefined) {
            updateData.discount = Number(updateData.discount);
        }

        if (updateData.sizes !== undefined || req.body.category) {
            const rawSizes = updateData.sizes !== undefined ? updateData.sizes : existingProduct.sizes;
            const sizeValidation = validateProductSizes(rawSizes, categoryDoc);
            if (sizeValidation.error) {
                return next(new ErrorHandler(400, sizeValidation.error));
            }
            updateData.sizes = sizeValidation.validSizes;
            const totalQuantity = updateData.sizes.length > 0
                ? updateData.sizes.reduce((sum, s) => sum + s.quantity, 0)
                : (updateData.quantity !== undefined ? Number(updateData.quantity) : existingProduct.quantity);
            updateData.quantity = totalQuantity;
            updateData.status = totalQuantity === 0 ? "OUT_OF_STOCK" : "IN_STOCK";
        } else if (updateData.quantity !== undefined) {
            updateData.quantity = Number(updateData.quantity);
            updateData.status = updateData.quantity === 0 ? "OUT_OF_STOCK" : "IN_STOCK";
        }

        const product = await updateProductRepo(req.params.id, updateData);

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
        const { quantity, size } = req.body;
        if (quantity === undefined || Number(quantity) < 0) {
            return next(new ErrorHandler(400, "Please provide a valid non-negative quantity"));
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler(404, "Product not found"));
        }

        const newQty = Number(quantity);

        if (size && product.sizes && product.sizes.length > 0) {
            const sizeItem = product.sizes.find((s) => s.size === size);
            if (!sizeItem) {
                return next(new ErrorHandler(400, `Size "${size}" not found on product`));
            }
            sizeItem.quantity = newQty;
            product.quantity = product.sizes.reduce((sum, s) => sum + s.quantity, 0);
        } else {
            product.quantity = newQty;
        }

        product.status = product.quantity === 0 ? "OUT_OF_STOCK" : "IN_STOCK";
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

import { Category } from "../model/category.model.js";
import { Product } from "../../product/model/product.model.js";
import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        return next(error);
    }
};

export const getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return next(new ErrorHandler(404, "Category not found"));
        }
        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        return next(error);
    }
};

export const getProductsByCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return next(new ErrorHandler(404, "Category not found"));
        }

        const products = await Product.find({ category: req.params.id });
        res.status(200).json({
            success: true,
            category: category.name,
            totalProducts: products.length,
            products
        });
    } catch (error) {
        return next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const { name, description, image, sizes } = req.body;
        if (!name) {
            return next(new ErrorHandler(400, "Category name is required"));
        }

        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return next(new ErrorHandler(400, "Category already exists"));
        }

        let parsedSizes = [];
        if (sizes) {
            const rawSizes = Array.isArray(sizes)
                ? sizes
                : typeof sizes === "string"
                ? (() => {
                      try {
                          const parsed = JSON.parse(sizes);
                          return Array.isArray(parsed) ? parsed : [sizes];
                      } catch {
                          return sizes.split(",").map((s) => s.trim());
                      }
                  })()
                : [];
            parsedSizes = [...new Set(rawSizes.map((s) => String(s).trim()).filter(Boolean))];
        }

        const category = await Category.create({
            name: name.trim(),
            description: description || "",
            image: image || "",
            sizes: parsedSizes
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        return next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const updateData = { ...req.body };

        if (updateData.name) {
            updateData.name = updateData.name.trim();
        }

        if (updateData.sizes !== undefined) {
            const rawSizes = Array.isArray(updateData.sizes)
                ? updateData.sizes
                : typeof updateData.sizes === "string"
                ? (() => {
                      try {
                          const parsed = JSON.parse(updateData.sizes);
                          return Array.isArray(parsed) ? parsed : [updateData.sizes];
                      } catch {
                          return updateData.sizes.split(",").map((s) => s.trim());
                      }
                  })()
                : [];
            updateData.sizes = [...new Set(rawSizes.map((s) => String(s).trim()).filter(Boolean))];
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return next(new ErrorHandler(404, "Category not found"));
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return next(new ErrorHandler(404, "Category not found"));
        }

        await Product.updateMany(
            { category: req.params.id },
            { $unset: { category: 1 } }
        );

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        return next(error);
    }
};


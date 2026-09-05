import Product from "./product.model.js";

export const findProductsRepo = async (query, sortOptions, skip, limit) => {
    return await Product.find(query)
        .populate("category", "name")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
};

export const countProductsRepo = async (query) => {
    return await Product.countDocuments(query);
};

export const findProductByIdRepo = async (id) => {
    return await Product.findById(id).populate("category", "name");
};

export const createProductRepo = async (productData) => {
    return await new Product(productData).save();
};

export const updateProductRepo = async (id, updateData) => {
    return await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
};

export const deleteProductRepo = async (id) => {
    return await Product.findByIdAndDelete(id);
};


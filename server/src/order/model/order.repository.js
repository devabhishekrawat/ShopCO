import Order from "./order.model.js";
import Cart from "../../cart/model/cart.model.js";
import Product from "../../product/model/product.model.js";
import Coupon from "../../coupon/model/coupon.model.js";

export const createOrderRepo = async (orderData, session = null) => {
    if (session) {
        const orders = await Order.create([orderData], { session });
        return orders[0];
    }
    return await Order.create(orderData);
};

export const findUserOrdersRepo = async (userId) => {
    return await Order.find({ user: userId })
        .populate("products.product", "name images price discount")
        .sort({ createdAt: -1 });
};

export const findOrderByIdRepo = async (id) => {
    return await Order.findById(id)
        .populate("products.product", "name images price discount");
};

export const findAllOrdersRepo = async () => {
    return await Order.find({})
        .populate("user", "name email")
        .populate("products.product", "name images price discount")
        .sort({ createdAt: -1 });
};

export const findOrderByIdAdminRepo = async (id) => {
    return await Order.findById(id)
        .populate("user", "name email")
        .populate("products.product", "name images price discount");
};

export const updateOrderStatusRepo = async (id, status) => {
    return await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );
};

export const findCartByUserIdRepo = async (userId, session = null) => {
    const query = Cart.findOne({ user: userId });
    if (session) query.session(session);
    return await query;
};

export const clearCartRepo = async (cart, session = null) => {
    cart.products = [];
    return await cart.save(session ? { session } : {});
};

export const findProductByIdForOrderRepo = async (productId, session = null) => {
    const query = Product.findById(productId);
    if (session) query.session(session);
    return await query;
};

export const findActiveCouponRepo = async (couponCode, session = null) => {
    const query = Coupon.findOne({
        code: couponCode.toUpperCase().trim(),
        isActive: true
    });
    if (session) query.session(session);
    return await query;
};

export const decrementStockRepo = async ({ productId, size, quantity }, session = null) => {
    let result;
    const sessionOption = session ? { session } : {};

    if (size) {
        result = await Product.updateOne(
            {
                _id: productId,
                "sizes.size": size,
                "sizes.quantity": { $gte: quantity },
                quantity: { $gte: quantity }
            },
            {
                $inc: {
                    "sizes.$.quantity": -quantity,
                    quantity: -quantity
                }
            },
            sessionOption
        );
    } else {
        result = await Product.updateOne(
            {
                _id: productId,
                quantity: { $gte: quantity }
            },
            {
                $inc: { quantity: -quantity }
            },
            sessionOption
        );
    }

    if (!result || result.modifiedCount === 0) {
        return false;
    }

    const findQuery = Product.findById(productId);
    if (session) findQuery.session(session);
    const updatedProd = await findQuery;

    if (updatedProd) {
        const totalStock = updatedProd.sizes && updatedProd.sizes.length > 0
            ? updatedProd.sizes.reduce((sum, s) => sum + s.quantity, 0)
            : updatedProd.quantity;
        updatedProd.quantity = totalStock;
        updatedProd.status = totalStock === 0 ? "OUT_OF_STOCK" : "IN_STOCK";
        await updatedProd.save(sessionOption);
    }

    return true;
};

export const updateInventoryAfterOrderRepo = async (productsToUpdate, session = null) => {
    for (const item of productsToUpdate) {
        await decrementStockRepo(
            { productId: item.productId, size: item.size, quantity: item.quantity },
            session
        );
    }
};

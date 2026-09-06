import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
        },

        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },

        discount: {
            type: Number,
            min: [0, "Discount cannot be negative"],
            max: [100, "Discount cannot be more than 100%"],
            default: 0,
        },

        images: {
            type: [String],
            default: [],
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Product category is required"],
        },

        sizes: [
            {
                size: {
                    type: String,
                    required: true,
                    trim: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [0, "Quantity cannot be negative"],
                    default: 0,
                },
            }
        ],

        quantity: {
            type: Number,
            min: [0, "Quantity cannot be negative"],
            default: 0,
        },

        status: {
            type: String,
            enum: ["IN_STOCK", "OUT_OF_STOCK"],
            default: "IN_STOCK",
        },
    },
    {
        timestamps: true,
    }
);

productSchema.pre("save", function () {
    if (this.sizes && this.sizes.length > 0) {
        this.quantity = this.sizes.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    }
    if (this.quantity === 0) {
        this.status = "OUT_OF_STOCK";
    } else {
        this.status = "IN_STOCK";
    }
});

export const Product = mongoose.model("Product", productSchema);
export default Product;

import mongoose from "mongoose";
import { env } from "../config/dotenv.js";
import Category from "../category/model/category.model.js";
import Product from "../product/model/product.model.js";
import Coupon from "../coupon/model/coupon.model.js";

const categoriesData = [
    {
        name: "T-Shirts",
        description: "Casual and comfortable t-shirts for daily wear",
        image: "/assets/category-tshirts.jpg"
    },
    {
        name: "Jeans",
        description: "Classic denim jeans with modern fit",
        image: "/assets/category-jeans.jpg"
    },
    {
        name: "Shirts",
        description: "Formal and casual shirts for men and women",
        image: "/assets/category-shirts.jpg"
    },
    {
        name: "Shoes",
        description: "Comfortable sneakers, casual shoes, and boots",
        image: "/assets/category-shoes.jpg"
    },
    {
        name: "Accessories",
        description: "Caps, belts, wallets, and watches",
        image: "/assets/category-accessories.jpg"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        console.log("Connected to MongoDB for seeding");

        await Product.deleteMany({});
        await Category.deleteMany({});
        await Coupon.deleteMany({});

        const createdCategories = await Category.insertMany(categoriesData);
        console.log(`Seeded ${createdCategories.length} categories`);

        const catMap = {};
        createdCategories.forEach((cat) => {
            catMap[cat.name] = cat._id;
        });

        const productsData = [
            {
                name: "Classic White Crewneck T-Shirt",
                description: "100% organic cotton t-shirt with premium finish and breathable feel",
                price: 499,
                discount: 10,
                images: [
                    "/assets/product-white-tshirt-1.jpg",
                    "/assets/product-white-tshirt-2.jpg"
                ],
                category: catMap["T-Shirts"],
                quantity: 45,
                status: "IN_STOCK"
            },
            {
                name: "Graphic Vintage T-Shirt",
                description: "Retro printed vintage oversized t-shirt made of heavy cotton",
                price: 699,
                discount: 15,
                images: [
                    "/assets/product-vintage-tshirt.jpg"
                ],
                category: catMap["T-Shirts"],
                quantity: 4,
                status: "IN_STOCK"
            },
            {
                name: "Black Minimalist T-Shirt",
                description: "Clean black regular fit t-shirt suitable for layering and casual wear",
                price: 549,
                discount: 0,
                images: [
                    "/assets/product-black-tshirt.jpg"
                ],
                category: catMap["T-Shirts"],
                quantity: 0,
                status: "OUT_OF_STOCK"
            },
            {
                name: "Slim Fit Blue Denim Jeans",
                description: "Stretchable blue denim jeans with 5 pockets and durable stitching",
                price: 1499,
                discount: 20,
                images: [
                    "/assets/product-blue-jeans.jpg"
                ],
                category: catMap["Jeans"],
                quantity: 25,
                status: "IN_STOCK"
            },
            {
                name: "Regular Fit Dark Charcoal Jeans",
                description: "Versatile charcoal wash regular fit jeans for work and casual outings",
                price: 1699,
                discount: 0,
                images: [
                    "/assets/product-charcoal-jeans.jpg"
                ],
                category: catMap["Jeans"],
                quantity: 3,
                status: "IN_STOCK"
            },
            {
                name: "Oxford Cotton Button-Down Shirt",
                description: "Timeless Oxford cotton long sleeve shirt with button-down collar",
                price: 1299,
                discount: 10,
                images: [
                    "/assets/product-oxford-shirt.jpg"
                ],
                category: catMap["Shirts"],
                quantity: 18,
                status: "IN_STOCK"
            },
            {
                name: "Casual Checked Flannel Shirt",
                description: "Warm and rugged brushed flannel checked shirt in classic red and black",
                price: 1199,
                discount: 25,
                images: [
                    "/assets/product-flannel-shirt.jpg"
                ],
                category: catMap["Shirts"],
                quantity: 2,
                status: "IN_STOCK"
            },
            {
                name: "Everyday White Sneakers",
                description: "Low-top cushioned sneakers designed for all-day comfort and style",
                price: 2499,
                discount: 10,
                images: [
                    "/assets/product-white-sneakers.jpg"
                ],
                category: catMap["Shoes"],
                quantity: 12,
                status: "IN_STOCK"
            },
            {
                name: "Running Sport Shoes",
                description: "Lightweight running shoes with shock absorbing foam soles",
                price: 2999,
                discount: 30,
                images: [
                    "/assets/product-running-shoes.jpg"
                ],
                category: catMap["Shoes"],
                quantity: 0,
                status: "OUT_OF_STOCK"
            },
            {
                name: "Genuine Leather Bifold Wallet",
                description: "Compact genuine leather wallet with RFID blocking and multiple card slots",
                price: 799,
                discount: 0,
                images: [
                    "/assets/product-leather-wallet.jpg"
                ],
                category: catMap["Accessories"],
                quantity: 30,
                status: "IN_STOCK"
            },
            {
                name: "Classic Stainless Steel Watch",
                description: "Water resistant analog wrist watch with silver stainless steel strap",
                price: 3499,
                discount: 15,
                images: [
                    "/assets/product-steel-watch.jpg"
                ],
                category: catMap["Accessories"],
                quantity: 5,
                status: "IN_STOCK"
            }
        ];

        const createdProducts = await Product.insertMany(productsData);
        console.log(`Seeded ${createdProducts.length} products with local asset paths`);

        const couponsData = [
            {
                code: "WELCOME10",
                discountType: "percentage",
                discountValue: 10,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: true
            },
            {
                code: "FLAT50",
                discountType: "fixed",
                discountValue: 50,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                isActive: true
            }
        ];

        const createdCoupons = await Coupon.insertMany(couponsData);
        console.log(`Seeded ${createdCoupons.length} coupons`);

        console.log("Database seeded successfully with local assets!");
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedDatabase();

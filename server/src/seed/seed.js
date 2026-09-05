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
                images: ["/assets/product-white-tshirt-1.jpg", "/assets/product-white-tshirt-2.jpg"],
                category: catMap["T-Shirts"],
                quantity: 45,
                status: "IN_STOCK"
            },
            {
                name: "Graphic Vintage T-Shirt",
                description: "Retro printed vintage oversized t-shirt made of heavy cotton",
                price: 699,
                discount: 15,
                images: ["/assets/product-vintage-tshirt.jpg"],
                category: catMap["T-Shirts"],
                quantity: 4,
                status: "IN_STOCK"
            },
            {
                name: "Black Minimalist T-Shirt",
                description: "Clean black regular fit t-shirt suitable for layering and casual wear",
                price: 549,
                discount: 0,
                images: ["/assets/product-black-tshirt.jpg"],
                category: catMap["T-Shirts"],
                quantity: 0,
                status: "OUT_OF_STOCK"
            },
            {
                name: "Striped Nautical Crew Tee",
                description: "Classic blue and white striped jersey cotton t-shirt",
                price: 599,
                discount: 5,
                images: ["/assets/product-striped-tee.jpg"],
                category: catMap["T-Shirts"],
                quantity: 20,
                status: "IN_STOCK"
            },
            {
                name: "V-Neck Charcoal Gray Tee",
                description: "Soft blended v-neck t-shirt with a slim modern silhouette",
                price: 479,
                discount: 0,
                images: ["/assets/product-vneck-gray.jpg"],
                category: catMap["T-Shirts"],
                quantity: 15,
                status: "IN_STOCK"
            },
            {
                name: "Oversized Streetwear Graphic Tee",
                description: "Drop-shoulder graphic tee featuring modern abstract artwork",
                price: 899,
                discount: 20,
                images: ["/assets/product-streetwear-tee.jpg"],
                category: catMap["T-Shirts"],
                quantity: 8,
                status: "IN_STOCK"
            },
            {
                name: "Olive Green Slim Fit Polo Tee",
                description: "Breathable piqué cotton polo t-shirt with ribbed collar",
                price: 799,
                discount: 10,
                images: ["/assets/product-olive-polo.jpg"],
                category: catMap["T-Shirts"],
                quantity: 12,
                status: "IN_STOCK"
            },
            {
                name: "Tie-Dye Summer Festival Tee",
                description: "Vibrant multi-color tie-dye cotton t-shirt",
                price: 649,
                discount: 25,
                images: ["/assets/product-tiedye-tee.jpg"],
                category: catMap["T-Shirts"],
                quantity: 18,
                status: "IN_STOCK"
            },
            {
                name: "Navy Blue Solid Henley Tee",
                description: "Three-button placket short-sleeve henley tee",
                price: 699,
                discount: 0,
                images: ["/assets/product-navy-henley.jpg"],
                category: catMap["T-Shirts"],
                quantity: 0,
                status: "OUT_OF_STOCK"
            },
            {
                name: "Pastel Pink Casual Tee",
                description: "Lightweight pastel pink crewneck in combed cotton",
                price: 499,
                discount: 5,
                images: ["/assets/product-pink-tee.jpg"],
                category: catMap["T-Shirts"],
                quantity: 30,
                status: "IN_STOCK"
            },
            {
                name: "Athletic Quick-Dry Gym Tee",
                description: "Moisture-wicking synthetic performance t-shirt for workouts",
                price: 599,
                discount: 15,
                images: ["/assets/product-gym-tee.jpg"],
                category: catMap["T-Shirts"],
                quantity: 25,
                status: "IN_STOCK"
            },

            {
                name: "Slim Fit Blue Denim Jeans",
                description: "Stretchable blue denim jeans with 5 pockets and durable stitching",
                price: 1499,
                discount: 20,
                images: ["/assets/product-blue-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 25,
                status: "IN_STOCK"
            },
            {
                name: "Regular Fit Dark Charcoal Jeans",
                description: "Versatile charcoal wash regular fit jeans for work and casual outings",
                price: 1699,
                discount: 0,
                images: ["/assets/product-charcoal-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 3,
                status: "IN_STOCK"
            },
            {
                name: "Distressed Light Wash Skinny Jeans",
                description: "Trendy light blue denim with distressed knee details",
                price: 1799,
                discount: 15,
                images: ["/assets/product-light-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 14,
                status: "IN_STOCK"
            },
            {
                name: "Jet Black Straight Cut Jeans",
                description: "Fade-resistant black heavy cotton straight fit denim",
                price: 1599,
                discount: 10,
                images: ["/assets/product-black-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 19,
                status: "IN_STOCK"
            },
            {
                name: "Relaxed Fit Vintage Denim",
                description: "Mid-rise relaxed denim with classic 90s wash",
                price: 1899,
                discount: 25,
                images: ["/assets/product-vintage-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 7,
                status: "IN_STOCK"
            },
            {
                name: "Tapered Fit Raw Indigo Jeans",
                description: "Unwashed raw indigo denim designed to age uniquely",
                price: 2199,
                discount: 0,
                images: ["/assets/product-raw-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 0,
                status: "OUT_OF_STOCK"
            },
            {
                name: "Utility Cargo Denim Pants",
                description: "Jeans equipped with side utility pockets and relaxed stretch",
                price: 1999,
                discount: 30,
                images: ["/assets/product-cargo-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 11,
                status: "IN_STOCK"
            },
            {
                name: "High-Waisted Ankle-Length Jeans",
                description: "Flattering high-waisted denim tailored to an ankle length",
                price: 1699,
                discount: 5,
                images: ["/assets/product-ankle-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 22,
                status: "IN_STOCK"
            },
            {
                name: "Acid Wash Retro Jeans",
                description: "Bold 80s style acid wash straight leg denim",
                price: 1749,
                discount: 10,
                images: ["/assets/product-acidwash-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 6,
                status: "IN_STOCK"
            },
            {
                name: "Flex-Stretch Slim Fit Jeans",
                description: "Ultra-flexible hybrid denim constructed for maximum movement",
                price: 1849,
                discount: 15,
                images: ["/assets/product-flex-jeans.jpg"],
                category: catMap["Jeans"],
                quantity: 16,
                status: "IN_STOCK"
            },

            // --- SHIRTS (10 Items) ---
            {
                name: "Oxford Cotton Button-Down Shirt",
                description: "Timeless Oxford cotton long sleeve shirt with button-down collar",
                price: 1299,
                discount: 10,
                images: ["/assets/product-oxford-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 18,
                status: "IN_STOCK"
            },
            {
                name: "Casual Checked Flannel Shirt",
                description: "Warm and rugged brushed flannel checked shirt in classic red and black",
                price: 1199,
                discount: 25,
                images: ["/assets/product-flannel-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 2,
                status: "IN_STOCK"
            },
            {
                name: "Slim Fit White Formal Shirt",
                description: "Crisp cotton formal shirt tailored for business wear",
                price: 1399,
                discount: 0,
                images: ["/assets/product-formal-white-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 35,
                status: "IN_STOCK"
            },
            {
                name: "Linen Blend Summer Beach Shirt",
                description: "Lightweight breathable linen blend short sleeve shirt",
                price: 1099,
                discount: 15,
                images: ["/assets/product-linen-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 10,
                status: "IN_STOCK"
            },
            {
                name: "Denim Western Button Shirt",
                description: "Rugged blue denim shirt with snap buttons and dual chest pockets",
                price: 1599,
                discount: 20,
                images: ["/assets/product-denim-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 0,
                status: "OUT_OF_STOCK"
            },
            {
                name: "Mandarin Collar Casual Shirt",
                description: "Modern band-collar cotton shirt for relaxed semi-formal events",
                price: 1249,
                discount: 5,
                images: ["/assets/product-mandarin-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 14,
                status: "IN_STOCK"
            },
            {
                name: "Floral Printed Resort Shirt",
                description: "Tropical printed short sleeve Cuban collar shirt",
                price: 999,
                discount: 30,
                images: ["/assets/product-floral-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 21,
                status: "IN_STOCK"
            },
            {
                name: "Chambray Casual Blue Shirt",
                description: "Soft woven chambray shirt with a textured cotton finish",
                price: 1349,
                discount: 10,
                images: ["/assets/product-chambray-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 17,
                status: "IN_STOCK"
            },
            {
                name: "Vertical Stripe Office Shirt",
                description: "Fine blue and white pinstriped long-sleeve cotton shirt",
                price: 1299,
                discount: 0,
                images: ["/assets/product-striped-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 9,
                status: "IN_STOCK"
            },
            {
                name: "Corduroy Overshirt Jacket",
                description: "Heavyweight ribbed corduroy shirt designed to layer as a jacket",
                price: 1899,
                discount: 15,
                images: ["/assets/product-corduroy-shirt.jpg"],
                category: catMap["Shirts"],
                quantity: 5,
                status: "IN_STOCK"
            },

            {
                name: "Everyday White Sneakers",
                description: "Low-top cushioned sneakers designed for all-day comfort and style",
                price: 2499,
                discount: 10,
                images: ["/assets/product-white-sneakers.jpg"],
                category: catMap["Shoes"],
                quantity: 12,
                status: "IN_STOCK"
            },
            {
                name: "Running Sport Shoes",
                description: "Lightweight running shoes with shock absorbing foam soles",
                price: 2999,
                discount: 30,
                images: ["/assets/product-running-shoes.jpg"],
                category: catMap["Shoes"],
                quantity: 0,
                status: "OUT_OF_STOCK"
            },
            {
                name: "Classic Leather Chelsea Boots",
                description: "Sleek ankle-high brown leather boots with elastic side panels",
                price: 3899,
                discount: 15,
                images: ["/assets/product-chelsea-boots.jpg"],
                category: catMap["Shoes"],
                quantity: 8,
                status: "IN_STOCK"
            },
            {
                name: "Canvas Casual Slip-On Shoes",
                description: "Breathable low-profile canvas slip-ons with durable rubber soles",
                price: 1299,
                discount: 5,
                images: ["/assets/product-canvas-slipons.jpg"],
                category: catMap["Shoes"],
                quantity: 26,
                status: "IN_STOCK"
            },
            {
                name: "Suede Penny Loafers",
                description: "Elegant suede slip-on loafers suitable for smart-casual wear",
                price: 3299,
                discount: 20,
                images: ["/assets/product-suede-loafers.jpg"],
                category: catMap["Shoes"],
                quantity: 7,
                status: "IN_STOCK"
            },
            {
                name: "High-Top Retro Sneakers",
                description: "Padded high-top sneakers with vintage color-blocking",
                price: 2799,
                discount: 10,
                images: ["/assets/product-hightop-sneakers.jpg"],
                category: catMap["Shoes"],
                quantity: 15,
                status: "IN_STOCK"
            },
            {
                name: "Waterproof Hiking Boots",
                description: "Rugged outdoor boots with deep traction tread and ankle support",
                price: 4299,
                discount: 25,
                images: ["/assets/product-hiking-boots.jpg"],
                category: catMap["Shoes"],
                quantity: 4,
                status: "IN_STOCK"
            },
            {
                name: "Black Formal Derby Shoes",
                description: "Polished genuine leather dress shoes for business attire",
                price: 3499,
                discount: 0,
                images: ["/assets/product-derby-shoes.jpg"],
                category: catMap["Shoes"],
                quantity: 10,
                status: "IN_STOCK"
            },
            {
                name: "Knit Mesh Trail Runners",
                description: "Flexible knit upper trail running shoes with grip rubber lugs",
                price: 2699,
                discount: 15,
                images: ["/assets/product-trail-runners.jpg"],
                category: catMap["Shoes"],
                quantity: 18,
                status: "IN_STOCK"
            },
            {
                name: "Comfort Foam Walking Sandals",
                description: "Adjustable strap casual sandals with memory foam footbed",
                price: 1199,
                discount: 10,
                images: ["/assets/product-walking-sandals.jpg"],
                category: catMap["Shoes"],
                quantity: 0,
                status: "OUT_OF_STOCK"
            },

            {
                name: "Genuine Leather Bifold Wallet",
                description: "Compact genuine leather wallet with RFID blocking and multiple card slots",
                price: 799,
                discount: 0,
                images: ["/assets/product-leather-wallet.jpg"],
                category: catMap["Accessories"],
                quantity: 30,
                status: "IN_STOCK"
            },
            {
                name: "Classic Stainless Steel Watch",
                description: "Water resistant analog wrist watch with silver stainless steel strap",
                price: 3499,
                discount: 15,
                images: ["/assets/product-steel-watch.jpg"],
                category: catMap["Accessories"],
                quantity: 5,
                status: "IN_STOCK"
            },
            {
                name: "Adjustable Cotton Baseball Cap",
                description: "Minimalist 6-panel cotton cap with metal buckle strap",
                price: 399,
                discount: 0,
                images: ["/assets/product-baseball-cap.jpg"],
                category: catMap["Accessories"],
                quantity: 40,
                status: "IN_STOCK"
            },
            {
                name: "Reversible Black/Brown Leather Belt",
                description: "Dual-sided genuine leather belt with rotating metallic buckle",
                price: 899,
                discount: 20,
                images: ["/assets/product-leather-belt.jpg"],
                category: catMap["Accessories"],
                quantity: 22,
                status: "IN_STOCK"
            },
            {
                name: "Polarized Aviator Sunglasses",
                description: "UV400 protection polarized sunglasses with lightweight metal frame",
                price: 1299,
                discount: 25,
                images: ["/assets/product-aviator-sunglasses.jpg"],
                category: catMap["Accessories"],
                quantity: 13,
                status: "IN_STOCK"
            },
            {
                name: "Minimalist Minimal Leather Cardholder",
                description: "Ultra-slim front pocket leather card sleeve with center cash slot",
                price: 499,
                discount: 10,
                images: ["/assets/product-cardholder.jpg"],
                category: catMap["Accessories"],
                quantity: 35,
                status: "IN_STOCK"
            },
            {
                name: "Ribbed Knit Winter Beanie",
                description: "Soft acrylic ribbed beanie hat designed for cold weather warmth",
                price: 449,
                discount: 5,
                images: ["/assets/product-winter-beanie.jpg"],
                category: catMap["Accessories"],
                quantity: 0,
                status: "OUT_OF_STOCK"
            },
            {
                name: "Chronograph Leather Strap Watch",
                description: "Multi-function chronograph watch with dark brown leather strap",
                price: 4299,
                discount: 20,
                images: ["/assets/product-chronograph-watch.jpg"],
                category: catMap["Accessories"],
                quantity: 6,
                status: "IN_STOCK"
            },
            {
                name: "Canvas Travel Duffel Bag",
                description: "Spacious heavy-duty canvas bag with shoulder strap for weekend trips",
                price: 2199,
                discount: 15,
                images: ["/assets/product-duffel-bag.jpg"],
                category: catMap["Accessories"],
                quantity: 11,
                status: "IN_STOCK"
            },
            {
                name: "Woven Braided Stretch Belt",
                description: "Flexible elastic braided belt with alloy pin buckle",
                price: 599,
                discount: 10,
                images: ["/assets/product-braided-belt.jpg"],
                category: catMap["Accessories"],
                quantity: 19,
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
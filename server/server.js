import { env } from "./src/config/dotenv.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { ConnectToDB } from "./src/config/dbConfig.js";
import userRoutes from "./src/user/route/user.route.js";
import productRoutes from "./src/product/route/product.route.js";
import categoryRoutes from "./src/category/route/category.route.js";
import cartRoutes from "./src/cart/route/cart.route.js";
import orderRoutes from "./src/order/route/order.route.js";
import reviewRoutes from "./src/review/route/review.route.js";
import adminRoutes from "./src/admin/route/admin.route.js";
import couponRoutes from "./src/coupon/route/coupon.route.js";
import { errorHandlerMiddleware } from "./src/middleware/errorHandlerMiddleware.js";

const server = express();

const corsOption = {
    origin: env.clientUrl || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
server.use(cors(corsOption));

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use("/assets", express.static(path.join(process.cwd(), "assets")));
server.use("/api/v1/shopco/assets", express.static(path.join(process.cwd(), "assets")));

server.use("/api/v1/shopco/user", userRoutes);
server.use("/api/v1/shopco/product", productRoutes);
server.use("/api/v1/shopco/category", categoryRoutes);
server.use("/api/v1/shopco/cart", cartRoutes);
server.use("/api/v1/shopco/order", orderRoutes);
server.use("/api/v1/shopco/review", reviewRoutes);
server.use("/api/v1/shopco/admin", adminRoutes);
server.use("/api/v1/shopco/coupon", couponRoutes);

server.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

server.use(errorHandlerMiddleware);

const startServer = async () => {
    try {
        await ConnectToDB();
        server.listen(env.port || 5000, () => {
            console.log(`Server is running on port ${env.port || 5000}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
};

startServer();

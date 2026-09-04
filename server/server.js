import { env } from "./src/config/dotenv.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ConnectToDB } from "./src/config/dbConfig.js";
import userRoutes from "./src/user/route/user.route.js"
import { errorHandlerMiddleware } from "./src/middleware/errorHandlerMiddleware.js";

const server = express();


const corsOption = {
    origin: ["http://localhost:5173"], // frontend URL
    credentials: true,               // allow cookies/sessions
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
server.use(cors(corsOption));

server.use(express.json());
server.use(cookieParser());

server.use("/api/v1/shopco/user", userRoutes);












server.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
server.use(errorHandlerMiddleware)


if (env.nodeEnv === "development") {
    console.log("Development mode");
} else if (env.nodeEnv === "production") {
    console.log("Production mode");
}

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

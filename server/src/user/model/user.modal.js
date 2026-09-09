import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/dotenv.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "User name is required"],
            maxlength: [30, "User name can't exceed 30 characters"],
            minlength: [2, "Name should have at least 2 characters"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "User email is required"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please enter a valid email"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password should have at least 6 characters"],
            select: false,
        },

        profileImg: {
            type: String,
            default: "https://example.com/default-avatar.png",
        },

        phone: {
            type: String,
            default: "",
        },

        address: {
            street: {
                type: String,
                default: "",
            },
            city: {
                type: String,
                default: "",
            },
            state: {
                type: String,
                default: "",
            },
            postalCode: {
                type: String,
                default: "",
            },
            country: {
                type: String,
                default: "",
            },
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, env.jwtSecret, {
        expiresIn: env.jwtExpireIn || "1d",
    });
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
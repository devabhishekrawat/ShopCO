import { createNewUserRepo, findUserRepo, deleteUserRepo, updateUserProfileRepo, getAllUsersRepo } from "../model/user.repository.js";
import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";
import { storeTokenInCookie } from "../../utils/storeToken.js";
import userModel from "../model/user.schema.js";

export const createNewUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, profileImg } = req.body;

        if (!name || !email || !password) {
            return next(new ErrorHandler(400, "Please provide name, email and password"));
        }

        const existingUser = await findUserRepo({ email });
        if (existingUser) {
            return next(new ErrorHandler(400, "Email already registered"));
        }

        const userData = {
            name,
            email,
            password,
            role: "user"
        };

        if (phone !== undefined) userData.phone = phone;
        if (profileImg !== undefined) userData.profileImg = profileImg;
        if (address !== undefined) userData.address = address;

        const newUser = await createNewUserRepo(userData);
        await storeTokenInCookie(newUser, res, 201);
    } catch (err) {
        if (err.code === 11000) {
            return next(new ErrorHandler(400, "Email already registered"));
        }
        return next(err);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler(400, "Please enter email and password"));
        }

        const user = await findUserRepo({ email }, true);
        if (!user) {
            return next(new ErrorHandler(401, "Invalid email or password"));
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler(401, "Invalid email or password"));
        }

        await storeTokenInCookie(user, res, 200);
    } catch (error) {
        return next(error);
    }
};

export const logoutUser = async (req, res, next) => {
    res.status(200)
        .cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
        })
        .json({
            success: true,
            message: "Logged out successfully"
        });
};

export const getMyProfile = async (req, res, next) => {
    try {
        const user = await findUserRepo({ _id: req.user._id });
        if (!user) {
            return next(new ErrorHandler(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(error);
    }
};

export const getUserDetails = async (req, res, next) => {
    try {
        const user = await findUserRepo({ _id: req.params.id || req.user._id });
        if (!user) {
            return next(new ErrorHandler(404, "User not found with provided ID"));
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const { name, email, profileImg, phone, address } = req.body;
        const updateData = {};

        if (name !== undefined) updateData.name = name;

        if (email !== undefined) {
            const emailExists = await userModel.findOne({ email, _id: { $ne: req.user._id } });
            if (emailExists) {
                return next(new ErrorHandler(400, "Email already in use"));
            }
            updateData.email = email;
        }

        if (profileImg !== undefined) updateData.profileImg = profileImg;
        if (phone !== undefined) updateData.phone = phone;

        if (address && typeof address === "object") {
            if (address.street !== undefined) updateData["address.street"] = address.street;
            if (address.city !== undefined) updateData["address.city"] = address.city;
            if (address.state !== undefined) updateData["address.state"] = address.state;
            if (address.postalCode !== undefined) updateData["address.postalCode"] = address.postalCode;
            if (address.country !== undefined) updateData["address.country"] = address.country;
        }

        const updatedUser = await updateUserProfileRepo(req.user._id, updateData);
        if (!updatedUser) {
            return next(new ErrorHandler(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersRepo();
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await deleteUserRepo(req.params.id);
        if (!deletedUser) {
            return next(new ErrorHandler(404, "User not found with provided ID"));
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        return next(error);
    }
};

export const updateUserProfileAndRole = async (req, res, next) => {
    try {
        const { role, name, email } = req.body;
        const updateData = {};

        if (role !== undefined) {
            if (!["user", "admin"].includes(role)) {
                return next(new ErrorHandler(400, "Role must be either user or admin"));
            }
            updateData.role = role;
        }

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;

        const updatedUser = await updateUserProfileRepo(req.params.id, updateData);
        if (!updatedUser) {
            return next(new ErrorHandler(404, "User not found with provided ID"));
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        return next(error);
    }
};

import { createNewUserRepo, findUserRepo, deleteUserRepo, updateUserProfileRepo, getAllUsersRepo } from "../model/user.repository.js";
import { ErrorHandler } from "../../middleware/errorHandlerMiddleware.js";
import { storeTokenInCookie } from "../../utils/storeToken.js";
import userModel from "../model/user.schema.js";
import { env } from "../../config/dotenv.js";



export const createNewUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log(req.body, "body")
    try {
        const newUser = await createNewUserRepo(req.body);

        // Implement sendWelcomeEmail function to send welcome message
        // await sendWelcomeEmail(newUser);
        // sending token
        await storeTokenInCookie(newUser, res, 200);
    } catch (err) {
        console.log(err)
        //  handle error for duplicate email
        if (err.code == 11000) {
            err.message = "Email already registered...!";
            return next(new ErrorHandler(400, err.message));
        }
        return next(new ErrorHandler(400, err));
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler(400, "please enter email/password"));
        }
        const user = await findUserRepo({ email }, true);
        if (!user) {
            return next(
                new ErrorHandler(401, "user not found! register yourself now!!")
            );
        }
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            return next(new ErrorHandler(401, "Invalid email or passswor!"));
        }
        await storeTokenInCookie(user, res, 200);
    } catch (error) {
        return next(new ErrorHandler(400, error));
    }
};

export const logoutUser = async (req, res, next) => {
    const isProduction = env.nodeEnv === "production";
    res
        .status(200)
        .cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "Lax" : "None",
        })
        .json({ success: true, msg: "logout successful" });
};

export const getUserDetails = async (req, res, next) => {
    try {
        const userDetails = await findUserRepo({ _id: req.params.id });
        if (!userDetails) {
            return res
                .status(400)
                .json({ success: false, msg: "no user found with provided id" });
        }
        res.status(200).json({ success: true, userDetails });
    } catch (error) {
        return next(new ErrorHandler(500, error));
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const {
            name,
            email,
            profileImg,
            phone,
            address,
        } = req.body;

        const updateData = { name, email, profileImg, phone, address };
        const updatedUserDetails = await updateUserProfileRepo(
            req.user._id,
            updateData
        );
        if (!updatedUserDetails) {
            return next(new ErrorHandler(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            user: updatedUserDetails,
        });
    } catch (error) {
        return next(new ErrorHandler(400, error.message));
    }
};


// admin controller 
export const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await getAllUsersRepo();
        res.status(200).json({ success: true, allUsers });
    }
    catch (error) {
        return next(new ErrorHandler(500, error));
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await deleteUserRepo(req.params.id);
        if (!deletedUser) {
            return res
                .status(400)
                .json({ success: false, msg: "no user found with provided id" });
        }
        res.status(200)
            .json({ success: true, msg: "user deleted successfully", deletedUser });
    } catch (error) {
        return next(new ErrorHandler(400, error));
    }
};

export const updateUserProfileAndRole = async (req, res, next) => {
    try {
        // console.log(req.body)
        const { name, email, role } = req.body;
        const id = req.params.id;
        // we are using this because if admin wants to change the any one value or the all three value
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (role !== undefined) updateData.role = role;
        // update the user data by admin 
        const updatedUserDetails = await updateUserProfileRepo(id, updateData);
        if (!updatedUserDetails) {
            return next(new ErrorHandler(404, "No user found with provided id"));
        }
        return res.status(201).json({ success: true, updatedUserDetails });

    } catch (err) {
        // Handle invalid ObjectId
        if (err.name === "CastError") {
            return next(new ErrorHandler(400, "Invalid user ID format"));
        }
        // console.log(err);
        return next(err);
    }
};


import express from "express";
import { auth, authByUserRole } from "../../middleware/authMiddleware.js";
import {
    createNewUser,
    userLogin,
    logoutUser,
    getMyProfile,
    getUserDetails,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    updateUserProfileAndRole
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/signup", createNewUser);
router.post("/login", userLogin);
router.post("/logout", logoutUser);
router.get("/logout", logoutUser);

router.get("/me", auth, getMyProfile);
router.get("/details", auth, getMyProfile);
router.patch("/profile", auth, updateUserProfile);
router.put("/profile/update", auth, updateUserProfile);

router.get("/admin/allusers", auth, authByUserRole("admin"), getAllUsers);
router.get("/admin/details/:id", auth, authByUserRole("admin"), getUserDetails);
router.delete("/admin/delete/:id", auth, authByUserRole("admin"), deleteUser);
router.patch("/admin/update/:id", auth, authByUserRole("admin"), updateUserProfileAndRole);
router.put("/admin/update/:id", auth, authByUserRole("admin"), updateUserProfileAndRole);

export default router;
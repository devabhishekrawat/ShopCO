import express from "express";
import { auth, authByUserRole } from "../../middleware/authMiddleware.js";
import {
    createNewUser, userLogin, logoutUser, getAllUsers, getUserDetails,
    updateUserProfile, updateUserProfileAndRole, deleteUser
} from "../controller/user.controller.js";



const router = express.Router();



router.route("/signup").post(createNewUser);
router.route("/login").post(userLogin);

router.route("/profile/update").put(auth, updateUserProfile);
router.route("/details").get(auth, getUserDetails);
router.route("/logout").get(auth, logoutUser);

// admin routes
router.route("/admin/allusers").get(auth, authByUserRole("admin"), getAllUsers);
router
    .route("/admin/details/:id")
    .get(auth, authByUserRole("admin"), getUserDetails);
 
router.route("/admin/delete/:id")
    .delete(auth, authByUserRole("admin"), deleteUser);

router.route("/admin/update/:id")
    .put(auth, authByUserRole("admin"), updateUserProfileAndRole);
export default router;
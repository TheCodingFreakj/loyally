import express from "express";
import { authUser, registerUser, updateRole ,delUser, getUsers } from "./authController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/get_auth_user", authUser);
router.get("/get_all_users", getUsers);
router.put("/update_roles", updateRole);
router.post("/delete_user", delUser);


export default router;
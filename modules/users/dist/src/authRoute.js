"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("./authController");
const router = express_1.default.Router();
router.post("/register", authController_1.registerUser);
router.post("/get_auth_user", authController_1.authUser);
router.get("/get_all_users", authController_1.getUsers);
router.put("/update_roles", authController_1.updateRole);
router.post("/delete_user", authController_1.delUser);
exports.default = router;

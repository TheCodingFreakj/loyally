"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delUser = exports.updateRole = exports.authUser = exports.getUsers = exports.registerUser = void 0;
const datashare_1 = require("./datashare");
const authModel_1 = require("./database/authModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = async (req, res) => {
    console.log(req.body);
    // {username, password, role} = req.body;
    if (!req.body.email || !req.body.password) {
        return res.json({
            message: "Please Provide all details",
        });
    }
    req.body.password = await bcrypt_1.default.hash(req.body.password, 10);
    const user = await new authModel_1.User({
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    });
    await user.save();
    (0, datashare_1.executeRabbitMQ)(req.body);
    return res.status(201).json({
        message: "user created successfully",
        user,
    });
};
exports.registerUser = registerUser;
const getUsers = async (req, res) => {
    const users = await authModel_1.User.find();
    return res.status(200).json({
        message: "sending users",
        users,
    });
};
exports.getUsers = getUsers;
const authUser = async (req, res) => {
};
exports.authUser = authUser;
const updateRole = (req, res) => { };
exports.updateRole = updateRole;
const delUser = (req, res) => { };
exports.delUser = delUser;

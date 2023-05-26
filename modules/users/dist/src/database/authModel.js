"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.IndexedUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        default: "User",
        required: true,
    },
});
const User = mongoose_1.default.model("Users", UserSchema);
exports.User = User;
const IndexedUserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 4,
        required: true,
    },
    role: {
        type: String,
        default: "User",
        required: true,
    },
});
IndexedUserSchema.index({ email: 1 });
const IndexedUser = mongoose_1.default.model("IndexedUsers", IndexedUserSchema);
exports.IndexedUser = IndexedUser;

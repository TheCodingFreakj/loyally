"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connMongodb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("./logger/logger");
const connMongodb = () => {
    try {
        mongoose_1.default.connect("mongodb+srv://pallavi57:pallavi57@Users.w4vdsoq.mongodb.net/Users?retryWrites=true&w=majority");
        logger_1.logger.info("Mongoose connected!");
    }
    catch (error) {
        console.log(error);
    }
};
exports.connMongodb = connMongodb;

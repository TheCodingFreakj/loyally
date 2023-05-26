"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const casual_1 = __importDefault(require("casual"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const worker_threads_1 = require("worker_threads");
const totalRecords = 50000;
const hashed = async () => {
    return await bcrypt_1.default.hash(casual_1.default.word, 10);
};
let newArr = [];
for (let index = 0; index < totalRecords / worker_threads_1.workerData.thread_count; index++) {
    newArr.push({
        email: casual_1.default.email,
        password: casual_1.default.string,
        role: casual_1.default.random_element(["Admin", "User"]),
    });
}
if (worker_threads_1.parentPort != null) {
    worker_threads_1.parentPort.postMessage(JSON.stringify(newArr));
}

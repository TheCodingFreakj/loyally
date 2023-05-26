"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const casual_1 = __importDefault(require("casual"));
const worker_threads_1 = require("worker_threads");
const { v4: uuidv4 } = require("uuid");
const totalRecords = 43;
let newArr = [];
let uniquesArray = [];
for (let index = 0; index < totalRecords / worker_threads_1.workerData.thread_count; index++) {
    newArr.push({
        user_id: () => uuidv4(),
        email: casual_1.default.email,
        password: casual_1.default.string,
        role: casual_1.default.random_element(["Admin", "User"]),
    });
}
uniquesArray = newArr.filter((r) => uniquesArray.indexOf(r.user_id) === -1);
if (worker_threads_1.parentPort != null) {
    worker_threads_1.parentPort.postMessage(JSON.stringify(uniquesArray));
}

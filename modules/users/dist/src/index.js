"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./logger/logger");
const response_time_1 = __importDefault(require("response-time"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// import("express-rate-limit")
// // import rateLimit from "express-rate-limit";
const authRoute_1 = __importDefault(require("./authRoute"));
const authModel_1 = require("./database/authModel");
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
console.log("hitting");
const app = (0, express_1.default)();
(0, db_1.connMongodb)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 5, // 5 calls
//   })
// );
app.use((0, response_time_1.default)());
async function benchmark() {
    const query = { role: { $eq: "Admin" } };
    console.time();
    await authModel_1.User.find(query);
    console.timeEnd();
    console.time();
    await authModel_1.User.find(query).lean();
    console.timeEnd();
    console.time();
    await authModel_1.User.find(query).select({ email: 1, role: 1 });
    console.timeEnd();
    console.time();
    await authModel_1.User.find(query).select({ email: 1, role: 1 }).lean();
    console.timeEnd();
    console.time();
    await authModel_1.IndexedUser.find(query);
    console.timeEnd();
    console.time();
    await authModel_1.IndexedUser.find(query).lean();
    console.timeEnd();
    console.time();
    await authModel_1.IndexedUser.find(query).select({ email: 1, role: 1 });
    console.timeEnd();
    console.time();
    await authModel_1.IndexedUser.find(query).select({ email: 1, role: 1 }).lean();
    console.timeEnd();
}
const THREAD_COUNT = 4;
function createWorker() {
    const worker_path = path_1.default.join(__dirname, "workers", "worker");
    return new Promise(function (resolve, reject) {
        const worker = new worker_threads_1.Worker(worker_path, {
            workerData: { thread_count: THREAD_COUNT },
        });
        worker.on("message", (data) => {
            return resolve(data);
        });
        worker.on("error", (msg) => {
            return reject(`An error ocurred: ${msg}`);
        });
        worker.on("exit", (code) => {
            if (code !== 0)
                return reject(new Error(`Stopped the Worker Thread with the exit code: ${code}`));
        });
    });
}
app.use("/api", authRoute_1.default);
app.get("/insert-data", async (req, res) => {
    const workerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
        workerPromises.push(createWorker());
    }
    const thread_results = await Promise.all(workerPromises);
    if (thread_results) {
        for (const iterator of thread_results) {
            try {
                authModel_1.User.insertMany(JSON.parse(iterator));
                authModel_1.IndexedUser.insertMany(JSON.parse(iterator));
                benchmark();
            }
            catch (err) {
                console.log(err);
            }
            // benchmark();
        }
    }
});
app.get("/", (req, res) => {
    res.send("GET Request Called");
});
app.listen(5000, () => {
    logger_1.logger.info("Server Running");
});
// https://www.youtube.com/watch?v=8iTt3rKh9Nw

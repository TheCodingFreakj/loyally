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
const mongoose_1 = __importDefault(require("mongoose"));
const chalk_1 = __importDefault(require("chalk"));
const authRoute_1 = __importDefault(require("./authRoute"));
const authModel_1 = require("./database/authModel");
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
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
mongoose_1.default.set("debug", false);
app.use((0, response_time_1.default)());
async function benchmark() {
    const query = { role: { $eq: "Admin" } };
    logger_1.logger.debug("LOGGING THE STATS");
    logger_1.logger.info("Showing Query Status For User");
    console.time(chalk_1.default.blue("query stats"));
    await authModel_1.User.find(query);
    console.log(chalk_1.default.bgGreen("query stats"));
    logger_1.logger.info(`Showing Query Status For User In lean Mode`);
    await authModel_1.User.find(query).lean();
    console.timeEnd(chalk_1.default.grey("query stats"));
    logger_1.logger.info("Showing Query Status For User");
    console.time(chalk_1.default.blue("query stats"));
    await authModel_1.User.find(query).select({ email: 1, role: 1 });
    console.timeEnd(chalk_1.default.redBright("query stats"));
    logger_1.logger.info("Showing Query Status For User in Lean Mode");
    console.time(chalk_1.default.blue("query stats"));
    await authModel_1.User.find(query).select({ email: 1, role: 1 }).lean();
    console.timeEnd(chalk_1.default.bgYellow("query stats"));
    logger_1.logger.info("Showing Query Status For Indexed User");
    console.time(chalk_1.default.blue("query stats"));
    await authModel_1.IndexedUser.find(query);
    console.timeEnd(chalk_1.default.gray("query stats"));
    logger_1.logger.info("Showing Query Status For Indexed User In Lean mode");
    console.time(chalk_1.default.blue("query stats"));
    await authModel_1.IndexedUser.find(query).lean();
    console.timeEnd(chalk_1.default.bgBlack("query stats"));
    logger_1.logger.info("Showing Query Status For Indexed User");
    console.time(chalk_1.default.blue("query stats"));
    await authModel_1.IndexedUser.find(query).select({ email: 1, role: 1 });
    console.timeEnd(chalk_1.default.bgGreenBright("query stats"));
    logger_1.logger.info("Showing Query Status For Indexed User in Lean Mode");
    console.time(chalk_1.default.blue("query stats"));
    await authModel_1.IndexedUser.find(query).select({ email: 1, role: 1 }).lean();
    console.timeEnd(chalk_1.default.bgRedBright("query stats"));
    const i = await authModel_1.IndexedUser.find().count();
    console.log("Total Records Inserted: ");
    console.log(i);
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
    });
}
function dbworker(thread_results) {
    const worker_path = path_1.default.join(__dirname, "workers", "dbinsert-worker");
    return new Promise(function (resolve, reject) {
        const dbWorker = new worker_threads_1.Worker(worker_path, {
            workerData: { thread_results: thread_results },
        });
        dbWorker.on("message", (data) => {
            return resolve(data);
        });
        dbWorker.on("error", (msg) => {
            return reject(`This is an error while inserting in DB: ${msg}`);
        });
    });
}
app.use("/api", authRoute_1.default);
app.get("/insert-data", async (req, res) => {
    try {
        const workerPromises = [];
        const dbworkerPromises = [];
        for (let i = 0; i < THREAD_COUNT; i++) {
            workerPromises.push(createWorker());
        }
        const thread_results = await Promise.all(workerPromises);
        // IndexedUser.deleteMany({});
        // User.deleteMany({});
        for (let i = 0; i < THREAD_COUNT; i++) {
            dbworkerPromises.push(dbworker(thread_results));
        }
        const thread_messages = await Promise.all(dbworkerPromises);
        console.log(thread_messages);
        // benchmark();
    }
    catch (err) {
        console.log("This is the error from insert db worker", err);
    }
});
app.get("/", (req, res) => {
    res.send("GET Request Called");
});
app.listen(5000, () => {
    logger_1.logger.info("Server Running");
});
// https://www.youtube.com/watch?v=8iTt3rKh9Nw

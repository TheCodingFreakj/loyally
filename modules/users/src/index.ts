import { connMongodb } from "./db";
import express from "express";
import dotenv from "dotenv";
import { logger } from "./logger/logger";
import responseTime from "response-time";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import chalk from "chalk";
import authRoute from "./authRoute";
import { User, IndexedUser } from "./database/authModel";
import { Worker } from "worker_threads";
import path from "path";

dotenv.config();

const app = express();
connMongodb();
app.use(express.json());
app.use(cors());
app.use(helmet());
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 5, // 5 calls
//   })
// );
mongoose.set("debug", false);
app.use(responseTime());

async function benchmark() {
  const query = { role: { $eq: "Admin" } };

  logger.debug("LOGGING THE STATS");
  logger.info("Showing Query Status For User");

  console.time(chalk.blue("query stats"));
  await User.find(query);
  console.log(chalk.bgGreen("query stats"));

  logger.info(`Showing Query Status For User In lean Mode`);
  await User.find(query).lean();
  console.timeEnd(chalk.grey("query stats"));

  logger.info("Showing Query Status For User");
  console.time(chalk.blue("query stats"));
  await User.find(query).select({ email: 1, role: 1 });
  console.timeEnd(chalk.redBright("query stats"));

  logger.info("Showing Query Status For User in Lean Mode");
  console.time(chalk.blue("query stats"));
  await User.find(query).select({ email: 1, role: 1 }).lean();
  console.timeEnd(chalk.bgYellow("query stats"));

  logger.info("Showing Query Status For Indexed User");
  console.time(chalk.blue("query stats"));
  await IndexedUser.find(query);
  console.timeEnd(chalk.gray("query stats"));

  logger.info("Showing Query Status For Indexed User In Lean mode");
  console.time(chalk.blue("query stats"));
  await IndexedUser.find(query).lean();
  console.timeEnd(chalk.bgBlack("query stats"));

  logger.info("Showing Query Status For Indexed User");
  console.time(chalk.blue("query stats"));
  await IndexedUser.find(query).select({ email: 1, role: 1 });
  console.timeEnd(chalk.bgGreenBright("query stats"));

  logger.info("Showing Query Status For Indexed User in Lean Mode");
  console.time(chalk.blue("query stats"));
  await IndexedUser.find(query).select({ email: 1, role: 1 }).lean();
  console.timeEnd(chalk.bgRedBright("query stats"));

  const i = await IndexedUser.find().count();

  console.log("Total Records Inserted: ");
  console.log(i);
}

const THREAD_COUNT = 4;

function createWorker() {
  const worker_path = path.join(__dirname, "workers", "worker");

  return new Promise(function (resolve, reject) {
    const worker = new Worker(worker_path, {
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

function dbworker(thread_results: any) {
  const worker_path = path.join(__dirname, "workers", "dbinsert-worker");

  return new Promise(function (resolve, reject) {
    const dbWorker = new Worker(worker_path, {
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
app.use("/api", authRoute);
app.get("/insert-data", async (req: any, res: any) => {
  try {
   
    const workerPromises = [];
    const dbworkerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
      workerPromises.push(createWorker());
    }
    const thread_results: any = await Promise.all(workerPromises);
    // IndexedUser.deleteMany({});
    // User.deleteMany({});

    for (let i = 0; i < THREAD_COUNT; i++) {
      dbworkerPromises.push(dbworker(thread_results));
    }
    const thread_messages: any = await Promise.all(dbworkerPromises);
    console.log(thread_messages);

    // benchmark();
  } catch (err) {
    console.log("This is the error from insert db worker", err);
  }
});
app.get("/", (req: any, res: any) => {
  res.send("GET Request Called");
});

app.listen(5000, () => {
  logger.info("Server Running");
});

// https://www.youtube.com/watch?v=8iTt3rKh9Nw

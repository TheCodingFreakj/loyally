import { connMongodb } from "./db";
import express from "express";
import dotenv from "dotenv";
import { logger } from "./logger/logger";
import responseTime from "response-time";
import cors from "cors";
import helmet from "helmet";
// import("express-rate-limit")
// // import rateLimit from "express-rate-limit";
import authRoute from "./authRoute";
import { User, IndexedUser } from "./database/authModel";
import { Worker } from "worker_threads";
import path from "path";

dotenv.config();
console.log("hitting");
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

app.use(responseTime());

async function benchmark() {
  const query = { role: { $eq: "Admin" } };

  console.time();
  await User.find(query);
  console.timeEnd();

  console.time();
  await User.find(query).lean();
  console.timeEnd();

  console.time();
  await User.find(query).select({ email: 1, role: 1 });
  console.timeEnd();

  console.time();
  await User.find(query).select({ email: 1, role: 1 }).lean();
  console.timeEnd();

  console.time();
  await IndexedUser.find(query);
  console.timeEnd();

  console.time();
  await IndexedUser.find(query).lean();
  console.timeEnd();

  console.time();
  await IndexedUser.find(query).select({ email: 1, role: 1 });
  console.timeEnd();

  console.time();
  await IndexedUser.find(query).select({ email: 1, role: 1 }).lean();
  console.timeEnd();
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
    worker.on("exit", (code) => {
      if (code !== 0)
        return reject(
          new Error(`Stopped the Worker Thread with the exit code: ${code}`)
        );
    });
  });
}
app.use("/api", authRoute);
app.get("/insert-data", async (req: any, res: any) => {
  const workerPromises = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }
  const thread_results: any = await Promise.all(workerPromises);

  if (thread_results) {
    for (const iterator of thread_results) {
      try {
        User.insertMany(JSON.parse(iterator));
        IndexedUser.insertMany(JSON.parse(iterator));
        benchmark();
      } catch (err) {
        console.log(err);
      }

      // benchmark();
    }
  }
});
app.get("/", (req: any, res: any) => {
  res.send("GET Request Called");
});

app.listen(5000, () => {
  logger.info("Server Running");
});

// https://www.youtube.com/watch?v=8iTt3rKh9Nw

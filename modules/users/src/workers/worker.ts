import casual from "casual";
import bcrypt from "bcrypt";
import { workerData, parentPort } from "worker_threads";

const totalRecords = 50000;

const hashed = async () => {
  return await bcrypt.hash(casual.word, 10);
};

let newArr: any[] = [];
for (let index = 0; index < totalRecords / workerData.thread_count; index++) {
  newArr.push({
    email: casual.email,
    password: casual.string,
    role: casual.random_element(["Admin", "User"]),
  });
}

if (parentPort != null) {
  parentPort.postMessage(JSON.stringify(newArr));
}

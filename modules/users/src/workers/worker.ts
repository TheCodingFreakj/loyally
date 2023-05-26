import casual from "casual";
import { workerData, parentPort } from "worker_threads";
const { v4: uuidv4 } = require("uuid");

const totalRecords = 43;

let newArr: any[] = [];
let uniquesArray: any[] = [];
for (let index = 0; index < totalRecords / workerData.thread_count; index++) {
  newArr.push({
    user_id: () => uuidv4(),
    email: casual.email,
    password: casual.string,
    role: casual.random_element(["Admin", "User"]),
  });
}

uniquesArray = newArr.filter((r) => uniquesArray.indexOf(r.user_id) === -1);

if (parentPort != null) {
  parentPort.postMessage(JSON.stringify(uniquesArray));
}

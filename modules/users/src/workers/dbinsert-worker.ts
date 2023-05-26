import { workerData, parentPort } from "worker_threads";
import { IndexedUser, User } from "../database/authModel";

// let thread = workerData.thread_results[0];
console.log("thread", workerData.thread_results.length);

// const indexdusers = IndexedUser.find();

for (let index = 0; index < workerData.thread_results.length; index++) {
  console.log(index);
  
  const element = workerData.thread_results[index];
// console.log("worlker", JSON.parse(element));
  
  User.insertMany(JSON.parse(element))
    .then(function () {
      console.log("Data inserted"); // Success
      if (parentPort != null) {
        parentPort.postMessage("Uploaded to DB");
      }
    })
    .catch(function (error) {
      console.log(error); // Failure
    });

  IndexedUser.insertMany(JSON.parse(element))
    .then(function () {
      console.log("Data inserted"); // Success
      if (parentPort != null) {
        parentPort.postMessage("Uploaded to DB");
      }
    })
    .catch(function (error) {
      console.log(error.message); // Failure
    });
}

User.find({})
  .then((users) => {
    console.log(users);
  })
  .catch((err) => {
    console.log(err.message);
  });


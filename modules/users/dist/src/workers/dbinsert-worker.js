"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const authModel_1 = require("../database/authModel");
// let thread = workerData.thread_results[0];
console.log("thread", worker_threads_1.workerData.thread_results.length);
// const indexdusers = IndexedUser.find();
for (let index = 0; index < worker_threads_1.workerData.thread_results.length; index++) {
    console.log(index);
    const element = worker_threads_1.workerData.thread_results[index];
    // console.log("worlker", JSON.parse(element));
    authModel_1.User.insertMany(JSON.parse(element))
        .then(function () {
        console.log("Data inserted"); // Success
        if (worker_threads_1.parentPort != null) {
            worker_threads_1.parentPort.postMessage("Uploaded to DB");
        }
    })
        .catch(function (error) {
        console.log(error); // Failure
    });
    authModel_1.IndexedUser.insertMany(JSON.parse(element))
        .then(function () {
        console.log("Data inserted"); // Success
        if (worker_threads_1.parentPort != null) {
            worker_threads_1.parentPort.postMessage("Uploaded to DB");
        }
    })
        .catch(function (error) {
        console.log(error.message); // Failure
    });
}
authModel_1.User.find({})
    .then((users) => {
    console.log(users);
})
    .catch((err) => {
    console.log(err.message);
});

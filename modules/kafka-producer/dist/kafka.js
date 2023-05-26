"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runProducer = void 0;
const kafkajs_1 = require("kafkajs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var username = process.env.KAFKA_USERNAME;
var password = process.env.KAFKA_PASSWORD;
const runProducer = () => {
    var kafkaserver = process.env.KAFKA_BOOTSTRAP_SERVER;
    var kafkaserver2 = process.env.KAFKA_BOOTSTRAP_SERVER2;
    return new kafkajs_1.Kafka({
        clientId: "loyally-producer",
        brokers: [
            "pkc-ymrq7.us-east-2.aws.confluent.cloud:9092",
            "pkc-lzvrd.us-west4.gcp.confluent.cloud:9092",
        ],
        logLevel: kafkajs_1.logLevel.DEBUG,
        connectionTimeout: 10000,
        authenticationTimeout: 10000,
        // username:"PNXHLONZMV2ZJPHUs",
        // password:"YNqlOFJwGvZ8BpenGBeKO0B/R7V2kjRqz8KUYtTEcBfjONSGj4UPIL16UlM5jTwp",
        // mechanism: "plain",
        // ssl: true,
    });
};
exports.runProducer = runProducer;
// export const kafka = new Kafka(KafkaConfig);

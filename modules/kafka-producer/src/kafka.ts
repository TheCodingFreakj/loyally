import { Kafka, logLevel } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

var username = process.env.KAFKA_USERNAME;
var password = process.env.KAFKA_PASSWORD;

export const runProducer = () => {
  var kafkaserver = process.env.KAFKA_BOOTSTRAP_SERVER;
  var kafkaserver2 = process.env.KAFKA_BOOTSTRAP_SERVER2;
  return new Kafka({
    clientId: "loyally-producer",
    brokers: [
      "pkc-ymrq7.us-east-2.aws.confluent.cloud:9092",
      "pkc-lzvrd.us-west4.gcp.confluent.cloud:9092",
    ],
    logLevel: logLevel.DEBUG,
    connectionTimeout: 10_000,
    authenticationTimeout: 10_000,
    // username:"PNXHLONZMV2ZJPHUs",
    // password:"YNqlOFJwGvZ8BpenGBeKO0B/R7V2kjRqz8KUYtTEcBfjONSGj4UPIL16UlM5jTwp",
    // mechanism: "plain",
    // ssl: true,
  });
};

// export const kafka = new Kafka(KafkaConfig);

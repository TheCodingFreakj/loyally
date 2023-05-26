"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeRabbitMQ = exports.executeRabbitMQ = exports.rabbitQConn = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
// import { User } from "./database/authModel.ts";
const amqp_url = "amqp://pallavi57:pallavi57@rabbitmq:5672";
var isCrashed = false;
const rabbitQConn = async () => {
    const connection = await amqplib_1.default.connect(amqp_url, "heartbeat=60");
    console.log("Connection with Rabbitmq was successful");
    return connection;
};
exports.rabbitQConn = rabbitQConn;
// https://medium.com/@rafael.guzman/how-to-consume-publish-rabbitmq-message-in-nodejs-cb68b5a6484c
const executeRabbitMQ = async (inputs) => {
    const connection = await (0, exports.rabbitQConn)();
    const channel = await connection.createChannel();
    try {
        console.log("Publishing");
        const exchange = inputs.email;
        const queue = JSON.stringify(inputs);
        const routingKey = inputs.email;
        await channel.assertExchange(exchange, "direct", { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);
        const msg = {
            id: Math.floor(Math.random() * 1000),
            email: inputs.email,
            password: inputs.password,
            role: inputs.role,
        };
        await channel.sendToQueue("User Details", Buffer.from(JSON.stringify(msg)));
        // await channel.publish(
        //   exchange,
        //   routingKey,
        //   Buffer.from(JSON.stringify(msg))
        // );
        console.log("Message published");
    }
    catch (e) {
        console.error("Error in publishing message", e);
    }
    finally {
        await (0, exports.consumeRabbitMQ)(inputs.email);
        if (isCrashed === true) {
            console.info("Closing channel and connection if available");
            await channel.close();
            await connection.close();
            console.info("Channel and connection closed");
        }
    }
    process.exit(0);
};
exports.executeRabbitMQ = executeRabbitMQ;
async function processMessage(msg) {
    console.log(msg.content.toString(), "Call email API here");
}
const consumeRabbitMQ = async (email) => {
    const connection = await (0, exports.rabbitQConn)();
    // const user = Users.findOne({ email: email });
    const channel = await connection.createChannel();
    channel.prefetch(10);
    // const queue = JSON.stringify(user);
    process.once("SIGINT", async () => {
        console.log("got sigint, closing connection");
        await channel.close();
        await connection.close();
        //
        isCrashed = true;
        process.exit(0);
    });
    await channel.assertQueue("User Details", { durable: true });
    await channel.consume("User Details", async (msg) => {
        console.log("processing messages");
        await processMessage(msg);
        await channel.ack(msg);
    }, {
        noAck: false,
        consumerTag: "email_consumer",
    });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
    isCrashed = false;
};
exports.consumeRabbitMQ = consumeRabbitMQ;
// https://www.loginradius.com/blog/engineering/guest-post/nodejs-authentication-guide/
// https://dev.to/aneeqakhan/create-mongodb-database-and-connect-with-mongoose-1ii2
// https://morioh.com/p/57487bdac5cf
// https://scanairobi.hashnode.dev/microservices-101-with-nodejs-and-rabbitmq

import amqplib from "amqplib";
import Users from "./authModel";

const amqp_url: any = "amqp://pallavi57:pallavi57@rabbitmq:5672";
var isCrashed = false;
export const rabbitQConn = async () => {
  const connection = await amqplib.connect(amqp_url, "heartbeat=60");
  console.log("Connection with Rabbitmq was successful");
  return connection;
};
// https://medium.com/@rafael.guzman/how-to-consume-publish-rabbitmq-message-in-nodejs-cb68b5a6484c
export const executeRabbitMQ = async (inputs: any) => {
  const connection = await rabbitQConn();
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
  } catch (e) {
    console.error("Error in publishing message", e);
  } finally {
    await consumeRabbitMQ(inputs.email);
    if (isCrashed === true) {
      console.info("Closing channel and connection if available");
      await channel.close();
      await connection.close();
      console.info("Channel and connection closed");
    }
  }
  process.exit(0);
};

async function processMessage(msg: any) {
  console.log(msg.content.toString(), "Call email API here");
}

export const consumeRabbitMQ = async (email: any) => {
  const connection = await rabbitQConn();
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
  await channel.consume(
    "User Details",
    async (msg: any) => {
      console.log("processing messages");

      await processMessage(msg);
      await channel.ack(msg);
    },
    {
      noAck: false,
      consumerTag: "email_consumer",
    }
  );
  console.log(" [*] Waiting for messages. To exit press CTRL+C");
  isCrashed = false;
};

// https://www.loginradius.com/blog/engineering/guest-post/nodejs-authentication-guide/
// https://dev.to/aneeqakhan/create-mongodb-database-and-connect-with-mongoose-1ii2
// https://morioh.com/p/57487bdac5cf
// https://scanairobi.hashnode.dev/microservices-101-with-nodejs-and-rabbitmq

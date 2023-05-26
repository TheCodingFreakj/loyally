import { runProducer } from "./kafka";

const kafkaConn = runProducer();
const producer = kafkaConn.producer();

const producerConn = async () => {
  await producer.connect();

  await producer.send({
    topic: "test-topic",
    messages: [{ value: "Hello KafkaJS user!" }],
  });
};

producerConn()

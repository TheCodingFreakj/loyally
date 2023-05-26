import amqplib from "amqplib";
export declare const rabbitQConn: () => Promise<amqplib.Connection>;
export declare const executeRabbitMQ: (inputs: any) => Promise<never>;
export declare const consumeRabbitMQ: (email: any) => Promise<void>;

const amqp = require('amqplib');
const winston = require('winston');

const QUEUE_NAME = 'task_queue';

// Setup Winston logger
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'm2.log' })
    ]
});

async function processTask(message) {
    // Simulate 5 seconds processing delay
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Task processing logic (double the number)
    const result = message * 2;

    // Return the result to RabbitMQ
    await sendMessageToQueue('result_queue', result);
    logger.info(`Processed task: ${JSON.stringify(message)}, Result: ${result}`);
}

async function sendMessageToQueue(queue, message) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
}

async function startWorker() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    channel.consume(QUEUE_NAME, async (msg) => {
        const message = JSON.parse(msg.content.toString());
        await processTask(message);
        channel.ack(msg);
    });
}

startWorker();

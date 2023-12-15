const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 5050;

// Setup Winston logger
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'm1.log' })
    ]
});

app.use(bodyParser.json());

app.post('/process', async (req, res) => {
    // Forward HTTP request to RabbitMQ
    const message = req.body;
    await sendMessageToQueue('task_queue', message);
    res.status(202).send('Task accepted for processing.');
    logger.info(`Received HTTP request: ${JSON.stringify(message)}`);
});

async function sendMessageToQueue(queue, message) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
}

app.listen(PORT, () => {
    console.log(`M1 Service is running on port ${PORT}`);
});

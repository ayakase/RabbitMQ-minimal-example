const amqp = require('amqplib/callback_api'); // Using callback-based API

const queueName = 'orders_queue';

const sendOrder = (order) => {
    // Connect to RabbitMQ server
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }

        // Create a channel
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            // Assert the queue exists
            channel.assertQueue(queueName, {
                durable: true,
            });

            // Send order to the queue
            const orderBuffer = Buffer.from(JSON.stringify(order));
            channel.sendToQueue(queueName, orderBuffer, {
                persistent: true, // Ensures message survives RabbitMQ restart
            });

            console.log(`Order sent: ${order.id}`);

            // Close the connection and channel after a short delay
            setTimeout(() => {
                channel.close();
                connection.close();
            }, 500);
        });
    });
};

// Example of creating a new order
const newOrder = {
    id: '12345',
    customer: 'John Doe',
    items: [
        { name: 'Laptop', quantity: 1 },
        { name: 'Mouse', quantity: 2 },
    ],
    total: 1200,
};

setInterval(() => {
    sendOrder(newOrder);
}, 2000);
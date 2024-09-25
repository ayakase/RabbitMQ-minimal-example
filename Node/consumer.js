const amqp = require('amqplib/callback_api'); // Using callback-based API

const queueName = 'orders_queue';

const processOrder = () => {
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

            // Set up the consumer to process incoming messages
            console.log('Waiting for orders...');

            channel.consume(
                queueName,
                (msg) => {
                    if (msg !== null) {
                        const order = JSON.parse(msg.content.toString());
                        console.log(`Processing order: ${order.id}`);

                        // Simulate order processing logic
                        setTimeout(() => {
                            console.log(`Order ${order.id} processed successfully.`);
                            // Acknowledge that the order has been processed
                            channel.ack(msg);
                        }, 2000); // Simulate some delay for processing
                    }
                },
                { noAck: false } // Ensure the message is acknowledged only after processing
            );
        });
    });
};

processOrder();

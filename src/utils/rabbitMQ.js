import amqp from 'amqplib'

export async function sendToSandboxQueue(message) {
    try {
      const connection = await amqp.connect('amqp://3.110.28.176');
      const channel = await connection.createChannel();
      const queue = 'myQueue';
  
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message));
  
      console.log(`Message sent: ${message}`);
  
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
    }
  }

  export async function sendToProductionQueue(message) {
    try {
      const connection = await amqp.connect('amqp://65.0.169.23');
      const channel = await connection.createChannel();
      const queue = 'myQueue';
  
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message));
  
      console.log(`Message sent: ${message}`);
  
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
    }
  }

  export async function consumeMessages() {
    try {
      const connection = await amqp.connect('amqp://localhost'); // RabbitMQ is on this server
      const channel = await connection.createChannel();
      const queue = 'myQueue';
  
      await channel.assertQueue(queue, { durable: true });
      console.log('Waiting for messages in %s. To exit press CTRL+C', queue);
  
      channel.consume(queue, (msg) => {
        if (msg !== null) {
          const messageContent = msg.content.toString();
          console.log(`Received message: ${messageContent}`);
          // Process the message here
  
          channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('Error consuming messages from RabbitMQ:', error);
    }
  }

  
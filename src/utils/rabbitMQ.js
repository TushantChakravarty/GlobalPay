import amqp from 'amqplib'
import { registerNewPassword, registerUserFromServer } from '../user/userService.js';

export async function sendToQueue(message,channelName) {
    try {
      const connection = await amqp.connect(`amqp://globalpay:globalpay07@${process.env.IPADDRESS}`);
      const channel = await connection.createChannel();
      const queue = channelName;
  
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(message));
  
      console.log(`Message sent: ${message}`);
  
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
    }
  }

  
  export async function consumeMessages(channelName) {
    try {
      const connection = await amqp.connect('amqp://localhost'); // RabbitMQ is on this server
      const channel = await connection.createChannel();
      const queue = channelName;
  
      await channel.assertQueue(queue, { durable: true });
      console.log('Waiting for messages in %s. To exit press CTRL+C', queue);
  
      channel.consume(queue, async (msg) => {
        if (msg !== null) {
          try {
            const messageContent = msg.content.toString();
            console.log(`Received message: ${messageContent}`);
  
            if (channelName === 'resetPassword') {
              await registerNewPassword(messageContent);
            }
            if (channelName === 'registerUser') {
              await registerUserFromServer(messageContent);
            }
            // Process the message here
  
            channel.ack(msg);
  
            // Purge the queue after processing the message
            await channel.purgeQueue(queue);
            console.log(`Queue ${queue} purged.`);
          } catch (processError) {
            console.error('Error processing message:', processError);
            // Optionally, acknowledge the message to remove it from the queue even if an error occurs
            channel.ack(msg); 
          }
        }
      });
    } catch (error) {
      console.error('Error consuming messages from RabbitMQ:', error);
    }
  }

  export async function initializeConsumers() {
    try {
      await consumeMessages('resetPassword').catch((e) => {
        console.log(e);
      });

      await consumeMessages('registerUser').catch((e) => {
        console.log(e);
      });
     
    } catch (e) {
      console.log(e);
    }
  }
  
  
  
  
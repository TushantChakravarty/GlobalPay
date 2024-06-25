import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify'
import registerRoutes from './src/routes/index.js'
import migrateDb from './src/utils/db.utils.js';
import fastifyCors from '@fastify/cors';
import { createUPICollectRequest, createUPIVirtualAccount, updateUPIVirtualAccount } from './src/gateways/zwitch/zwitchServices.js';
import { createPaymentLinkViaRazorpay } from './src/gateways/razorpay/razorpayService.js';
import { convertToIST } from './src/utils/utils.js';
import { consumeMessages, initializeConsumers } from './src/utils/rabbitMQ.js';
const fastify = Fastify({
    logger: true
})


fastify.register(fastifyCors, { 
    // put your options here
    origin: '*', // allow all origins
    methods: ['GET', 'PUT', 'POST', 'DELETE'], // allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization','apiKey','apikey'], // allow these headers
  });

const startServer = async () => {

    try {
        await migrateDb()
       
          
        registerRoutes(fastify)
        fastify.get('/hello', async (request, reply) => {
            return { message: 'Hello World' };
        });
        await fastify.listen({ port: 3000 })
        await initializeConsumers()
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
//
startServer()
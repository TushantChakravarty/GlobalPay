import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify'
import registerRoutes from './src/routes/index.js'
import migrateDb from './src/utils/db.utils.js';
import fastifyCors from '@fastify/cors';
import { createUPICollectRequest, createUPIVirtualAccount, updateUPIVirtualAccount } from './src/gateways/zwitch/zwitchServices.js';
import { createPaymentLinkViaRazorpay } from './src/gateways/razorpay/razorpayService.js';
const fastify = Fastify({
    logger: true
})

fastify.register(fastifyCors, { 
    // put your options here
    origin: '*', // allow all origins
    methods: ['GET', 'PUT', 'POST', 'DELETE'], // allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization','apiKey','apikey'], // allow these headers
  });
createPaymentLinkViaRazorpay({
    amount:2000
})
//fetchPayments('gjoI9dQke60Y')
// createRazorpayPayoutService({
//     name:'tushant',
//     phone:'9340079982',
//     email:'tushant029@gmail.com',
//     upi:'9340079982@paytm',
//     amount:100
// },"vpa")
//createUPICollectRequest()
//createUPIVirtualAccount()
//updateUPIVirtualAccount()
const startServer = async () => {

    try {
        await migrateDb()
       
          
        registerRoutes(fastify)
        fastify.get('/hello', async (request, reply) => {
            return { message: 'Hello World' };
        });
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
//
startServer()
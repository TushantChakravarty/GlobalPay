import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify'
import registerRoutes from './src/routes/index.js'
import { createPayout, createPayoutVpa } from './src/gateways/razorpay/razorpayService.js';
import { bulkpeUpiCollect } from './src/gateways/bulkpe/bulkpe.js';
import { cashfreePayin } from './src/gateways/cashfree/cashfree.js';
const fastify = Fastify({
  logger: true
})
bulkpeUpiCollect()
cashfreePayin({
    amount:10,
    phone:9340079982
})
const startServer = async ()=>{

    try {
        registerRoutes(fastify)
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

// Run the server!
startServer()
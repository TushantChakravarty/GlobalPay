import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify'
import registerRoutes from './src/routes/index.js'
//import migrateDb from './src/utils/db.utils.js';
const fastify = Fastify({
    logger: true
})

//await migrateDb()

// createRazorpayPayoutService({
//     name:'tushant',
//     phone:'9340079982',
//     email:'tushant029@gmail.com',
//     upi:'9340079982@paytm',
//     amount:100
// },"vpa")
const startServer = async () => {

    try {
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
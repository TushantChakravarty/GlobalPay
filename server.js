import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify'
import registerRoutes from './src/routes/index.js'
const fastify = Fastify({
  logger: true
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
//
startServer()
import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify'
import registerRoutes from './src/routes/index.js'
import migrateDb from './src/utils/db.utils.js';
const fastify = Fastify({
  logger: true
})

await migrateDb()


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
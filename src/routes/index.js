import Fastify from 'fastify'
import neftRoutes from '../neft/routes.js'

const registerRoutes = ()=>{

    const fastify = Fastify({
        logger: true
    })
    
    fastify.register(neftRoutes)
}

export default registerRoutes
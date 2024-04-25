import neftRoutes from '../neft/routes.js'

const registerRoutes = (fastify)=>{
    fastify.register(neftRoutes)
}

export default registerRoutes
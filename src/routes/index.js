import neftRoutes from "../gateways/yesBank/neft/routes"

neftRoutes
const registerRoutes = (fastify)=>{
    fastify.register(neftRoutes)
}

export default registerRoutes
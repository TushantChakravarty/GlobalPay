import payinUpiRoutes from '../payin/upi/payinRoutes.js'
import neftRoutes from '../payout/neft/routes.js'

const registerRoutes = (fastify)=>{
    fastify.register(neftRoutes)
    fastify.register(payinUpiRoutes, { prefix: '/payin/upi' });

}

export default registerRoutes
import paymentPageRoutes from '../payin/paymentPage/payinPageRoutes.js';
import payinUpiRoutes from '../payin/upi/payinRoutes.js'
import neftRoutes from '../payout/neft/routes.js'

const registerRoutes = (fastify)=>{
    fastify.register(neftRoutes)
    fastify.register(payinUpiRoutes, { prefix: '/payin/upi' });
    fastify.register(paymentPageRoutes, { prefix: '/payin/hosted' });

}

export default registerRoutes
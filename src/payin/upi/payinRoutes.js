import { bulkpeUpiCollect } from "../../gateways/bulkpe/bulkpe.js";


async function payinUpiRoutes (fastify, options) {

    fastify.get('/upiCollect', async (request, reply) => {
      const response =await bulkpeUpiCollect();
      return reply.send(response) 
    })


  }
  
export default payinUpiRoutes;
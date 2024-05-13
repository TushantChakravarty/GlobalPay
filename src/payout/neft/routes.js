import { neftTransfer } from "./neftServices.js"
import { bulkpeUpiCollect } from "../../gateways/bulkpe/bulkpe.js"

async function neftRoutes (fastify, options) {
    fastify.get('/', async (request, reply) => {
      return { hello: 'neft' }
    })

    fastify.get('/neft/transfer', async (request, reply) => {
      const response =await neftTransfer()
      return { hello: response }
    })
    fastify.get('/bulkpePayinCollect', async (request, reply) => {
      const response =await bulkpeUpiCollect();
      return reply.send(response) 
    })
  }
  
export default neftRoutes;
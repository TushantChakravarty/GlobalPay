import { neftTransfer } from "./neftServices.js"

async function neftRoutes (fastify, options) {
    fastify.get('/', async (request, reply) => {
      return { hello: 'neft' }
    })

    fastify.get('/neft/transfer', async (request, reply) => {
      const response =await neftTransfer()
      return { hello: response }
    })
 
  }
  
export default neftRoutes;
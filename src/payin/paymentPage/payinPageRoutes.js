import { createPaymentPageRequest } from "./payinPageServices.js";


async function paymentPageRoutes (fastify, options) {

    fastify.post('/hostedPage', async (request, reply) => {
      const response = await createPaymentPageRequest(request?.body)
      return reply.send(response) 
    })


  }
  
export default paymentPageRoutes;
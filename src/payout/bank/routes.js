import { createRazorpayPayoutService } from "../../gateways/razorpay/razorpayService.js"
import { neftTransfer } from "./neftServices.js"

async function payoutBankRoutes(fastify, options) {


  fastify.post('/bank', async (request, reply) => {

    const response = await createRazorpayPayoutService(request.body, request.body.type)
    return reply.status(200).send(response)
  })

}



export default payoutBankRoutes;
import { createRazorpayPayoutService } from "../../gateways/razorpay/razorpayService.js"
import { createZwitchPayoutService } from "../../gateways/zwitch/zwitchService.js"
import { neftTransfer } from "./neftServices.js"
import { findUser, findUserByApiKey } from "../../user/userDao.js"
import { validateToken, validateTokenAndApiKey } from "../../utils/jwt.utils.js"
import { payoutBankController, payoutUpiController } from "./payoutController.js"

async function payoutBankRoutes(fastify, options) {
  fastify.addHook('preValidation', validateTokenAndApiKey)
  fastify.post('/bank', async (request, reply) => {
    const apiKey = request?.apiKeyDetails
    const user = await findUserByApiKey(apiKey)
    request.body.email_id = user?.dataValues?.email_id
    request.user = user
    const response = await payoutBankController(request)
    return reply.status(200).send(response)
  })
  fastify.post('/upi', async (request, reply) => {
    const apiKey = request?.apiKeyDetails
    const user = await findUserByApiKey(apiKey)
    request.body.email_id = user?.dataValues?.email_id
    request.user = user
    const response = await payoutUpiController(request)
    return reply.status(200).send(response)
  })


}


export default payoutBankRoutes;
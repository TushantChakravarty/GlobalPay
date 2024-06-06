import { createRazorpayPayoutService } from "../../gateways/razorpay/razorpayService.js"
import { createZwitchPayoutService } from "../../gateways/zwitch/zwitchService.js"
import { neftTransfer } from "./neftServices.js"
import { findUser, findUserByApiKey } from "../../user/userDao.js"
import { validateToken, validateTokenAndApiKey } from "../../utils/jwt.utils.js"
import { payoutBankController, payoutUpiController } from "./payoutController.js"
import { findUserByApiKey } from "../../user/userDao.js"
import { CODES, MESSAGES } from "../../utils/constants.js"
import { validateTokenAndApiKey } from "../../utils/jwt.utils.js"
import { responseMapping, responseMappingWithData } from "../../utils/mapper.js"
import { bankPayouts } from "./services.js"


async function payoutBankRoutes(fastify, options) {
  fastify.addHook('preValidation', validateTokenAndApiKey)
  fastify.post('/bank', async (request, reply) => {
    try {
      const apiKey = request?.apiKeyDetails
      const user = await findUserByApiKey(apiKey)
      request.body.email_id = user?.dataValues?.email_id
      request.user = user
      const response = await payoutBankController(request)
      return reply.status(200).send(response)
    } catch (error) {
      return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR))
    }

  })
  fastify.post('/upi', async (request, reply) => {
    try {
      const apiKey = request?.apiKeyDetails
      const user = await findUserByApiKey(apiKey)
      request.body.email_id = user?.dataValues?.email_id
      request.user = user
      const response = await payoutUpiController(request)
      return reply.status(200).send(response)

    } catch (error) {
      return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR))
    }

  })

}

export default payoutBankRoutes;
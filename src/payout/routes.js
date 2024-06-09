import { findUser, findUserByApiKey } from "../user/userDao.js"
import { validateToken, validateTokenAndApiKey } from "../utils/jwt.utils.js"
import { getPayoutTransactions, payoutBankController, payoutUpiController } from "./services.js"
import { CODES, MESSAGES } from "../utils/constants.js"
import { responseMapping, responseMappingWithData } from "../utils/mapper.js"
import { bankSchema, upiSchema } from "../utils/validationSchemas.js";



async function payoutRoutes(fastify, options) {
  // fastify.addHook('preValidation', validateTokenAndApiKey)
  /**
   * Route for doing payout through bank
   * data:- name,email,phone,bank_name,ifsc,account_number
   */
  fastify.post('/bank', {
    schema: bankSchema,
    preValidation: validateTokenAndApiKey
  },
    async (request, reply) => {
      try {
        const apiKey = request?.apiKeyDetails
        const user = await findUserByApiKey(apiKey)
        if (!user) {
          return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR))
        }
        if (!user.payoutsActive) {
          return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, "Payout not active"))
        }
        if (user.payoutsBalance < request.body.amount) {
          return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, "Insufficient balance"))
        }
        request.body.email_id = user?.dataValues?.email_id
        const response = await payoutBankController(request)
        return reply.status(200).send(response)
      } catch (error) {
        return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR))
      }
    })
  /**
 * Route for doing payout through upi
 * data:- name,email,phone,upi
 */
  fastify.post('/upi', {
    schema: upiSchema,
    preValidation: validateTokenAndApiKey
  },
    async (request, reply) => {
      try {
        const apiKey = request?.apiKeyDetails
        const user = await findUserByApiKey(apiKey)
        if (!user) {
          return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR))
        }
        if (!user.payoutsActive) {
          return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, "Payout not active"))
        }
        if (user.payoutsBalance < request.body.amount) {
          return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, "Insufficient balance"))
        }
        request.body.email_id = user?.dataValues?.email_id
        request.user = user
        const response = await payoutUpiController(request)
        return reply.status(200).send(response)
      } catch (error) {
        return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR))
      }

    })

  fastify.get('/getAllPayouts', {
    //preValidation: validateTokenAndApiKey
  },
    async (request, reply) => {
      try {
        // const apiKey = request?.apiKeyDetails
        // const user = await findUserByApiKey(apiKey)
        // request.body.email_id = user?.dataValues?.email_id
        // request.user = user
        const response = await getPayoutTransactions()
        return reply.status(200).send(response)
      } catch (error) {
        return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR))
      }

    })

}

export default payoutRoutes;
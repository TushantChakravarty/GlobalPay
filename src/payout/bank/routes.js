import { findUser, findUserByApiKey } from "../../user/userDao.js"
import { validateToken, validateTokenAndApiKey } from "../../utils/jwt.utils.js"
import { payoutBankController, payoutUpiController } from "./payoutController.js"
import { CODES, MESSAGES } from "../../utils/constants.js"
import { responseMapping, responseMappingWithData } from "../../utils/mapper.js"

const bankSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'phone', 'ifsc', 'bank_name', 'account_number'],
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      email: {
        type: 'string',
        format: 'email'
      },
      phone: {
        type: 'string',
        pattern: '^[0-9]{10}$'
      },
      ifsc: {
        type: 'string',
        pattern: '^[A-Z]{4}0[A-Z0-9]{6}$'
      },
      bank_name: {
        type: 'string'
      },
      amount: { type: "number", minimum: 0.0 },
      account_number: {
        type: 'string',
        minLength: 9,
        maxLength: 18
      }
    }

  }

};
const upiSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'phone', 'upi', "amount"], // All fields are required
    properties: {
      name: { type: 'string', minLength: 1 }, // Name must be a non-empty string
      email: {
        type: 'string',
        format: 'email' // Validate as email
      },
      phone: {
        type: 'string',
        pattern: '^[0-9]{10}$' // Validate as a 10-digit phone number
      },
      amount: { type: "number", minimum: 0.0 },
      upi: {
        type: 'string',
        pattern: '^[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}$' // Validate as UPI ID pattern
      },
    },
  },

}


async function payoutBankRoutes(fastify, options) {
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
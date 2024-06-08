import { findUser, findUserByApiKey } from "../../user/userDao.js"
import { validateToken, validateTokenAndApiKey } from "../../utils/jwt.utils.js"
import { payoutBankController, payoutUpiController } from "./payoutController.js"
import { CODES, MESSAGES } from "../../utils/constants.js"
import { responseMapping, responseMappingWithData } from "../../utils/mapper.js"

const bankSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'phone', 'ifsc', 'bank_name', 'account_number'], // All fields are required
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
      ifsc: {
        type: 'string',
        pattern: '^[A-Z]{4}0[A-Z0-9]{6}$' // Validate as IFSC code (4 letters, 0, 6 alphanumeric)
      },
      bank_name: {
        type: 'string'
      },
      account_number: {
        type: 'string',
        minLength: 9,
        maxLength: 18 // Validate account number length
      },
    },
    errorMessage: {
      required: {
        name: 'Name is required',
        email: 'Email is required',
        phone: 'Phone number is required',
        bank_name: 'Bank name is required',
        ifsc: 'IFSC code is required',
        account_number: 'Account number is required',
      },
      properties: {
        name: 'Name must be a non-empty string',
        email: 'Email must be a valid email address',
        phone: 'Phone number must be a 10-digit number',
        bank_name: 'Bank Name must be string',
        ifsc: 'IFSC code must be in the format: 4 letters, 0, 6 alphanumeric characters',
        account_number: 'Account number must be between 9 and 18 characters long',
      },
    },
  },
};
const upiSchema = {
  body: {
    type: 'object',
    required: ['name', 'email', 'phone', 'upi'], // All fields are required
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
      upi: {
        type: 'string',
        pattern: '^[a-zA-Z0-9.\\-_]{2,256}@[a-zA-Z]{2,64}$' // Validate as UPI ID pattern
      },
    },
    errorMessage: {
      required: {
        name: 'Name is required',
        email: 'Email is required',
        phone: 'Phone number is required',
        upi: 'UPI ID is required',
      },
      properties: {
        name: 'Name must be a non-empty string',
        email: 'Email must be a valid email address',
        phone: 'Phone number must be a 10-digit number',
        upi: 'UPI ID must be a valid format',
      },
    },
  },
};



async function payoutBankRoutes(fastify, options) {
  fastify.addHook('preValidation', validateTokenAndApiKey)
  /**
   * Route for doing payout through bank
   * data:- name,email,phone,bank_name,ifsc,account_number
   */
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
  /**
 * Route for doing payout through upi
 * data:- name,email,phone,upi
 */
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
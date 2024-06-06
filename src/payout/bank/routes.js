import { createRazorpayPayoutService } from "../../gateways/razorpay/razorpayService.js"
import { createZwitchPayoutService } from "../../gateways/zwitch/zwitchService.js"
import { findUserByApiKey } from "../../user/userDao.js"
import { CODES, MESSAGES } from "../../utils/constants.js"
import { validateTokenAndApiKey } from "../../utils/jwt.utils.js"
import { responseMapping, responseMappingWithData } from "../../utils/mapper.js"
import { bankPayouts } from "./services.js"

async function payoutBankRoutes(fastify, options) {

  fastify.addHook('preValidation', validateTokenAndApiKey);

  fastify.post('/bank', async (request, reply) => {
    try{
      const apiKey  = request?.apiKeyDetails
      //console.log(apiKey)
      
      const user = await findUserByApiKey(apiKey)
      //console.log('userrr',user?.dataValues?.email_id)
      request.body.email_id = user?.dataValues?.email_id
      

      const response = await bankPayouts(request.body, request.body.type)
      return reply.status(200).send(response)
    }catch(error)
    {
      return reply.status(500).send(responseMapping(CODES.INTRNLSRVR,MESSAGES.INTERNAL_SERVER_ERROR))
    }
  })


}


export default payoutBankRoutes;
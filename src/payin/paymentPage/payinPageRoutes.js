import { findUser, findUserByApiKey } from "../../user/userDao.js";
import { CODES, MESSAGES } from "../../utils/constants.js";
import { validateToken, validateTokenAndApiKey } from "../../utils/jwt.utils.js";
import { responseMapping } from "../../utils/mapper.js";
import { payinPageSchema } from "../../utils/validationSchemas.js";
import { createPaymentPageRequest } from "./payinPageServices.js";

async function paymentPageRoutes(fastify, options) {
    fastify.addHook('preValidation', validateTokenAndApiKey);
    fastify.post('/hostedPage', {
        schema: payinPageSchema
    }, async (request, reply) => {
        try {

            const apiKey = request?.apiKeyDetails
            //console.log(apiKey)
            const user = await findUserByApiKey(apiKey)
            if (user.isBanned) {
                return responseMapping(CODES.INTRNLSRVR, "Your Payin service has been temporarily suspended, Please contact us to resolve the issue")
            }
            //console.log('userrr',user?.dataValues?.email_id)
            request.body.email_id = user?.dataValues?.email_id

            const response = await createPaymentPageRequest(request.body);
            return reply.status(200).send(response);
        } catch (error) {
            console.log('payin page', error)
            return responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR)
        }
    });
}

export default paymentPageRoutes;

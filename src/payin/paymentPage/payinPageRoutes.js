import { findUser, findUserByApiKey } from "../../user/userDao.js";
import { validateToken, validateTokenAndApiKey } from "../../utils/jwt.utils.js";
import { createPaymentPageRequest } from "./payinPageServices.js";

async function paymentPageRoutes(fastify, options) {
    fastify.addHook('preValidation', validateTokenAndApiKey);
    fastify.post('/hostedPage', {
        schema: {
            body: {
                type: 'object',
                required: ['amount'],
                properties: {
                    amount: { type: 'number', minimum: 0.01 },
                    customer_emailId: { type: 'string', format: 'email' },
                    customer_phone: { type: 'string' },
                    customer_address: { type: 'string' },
                    customer_name: { type: 'string' },
                    transaction_id: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const apiKey  = request?.apiKeyDetails
        //console.log(apiKey)
        const user = await findUserByApiKey(apiKey)
        //console.log('userrr',user?.dataValues?.email_id)
        request.body.email_id = user?.dataValues?.email_id
        const response = await createPaymentPageRequest(request.body);
        return reply.send(response);
    });
}

export default paymentPageRoutes;

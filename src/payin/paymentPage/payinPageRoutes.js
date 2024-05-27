import { validateToken, validateTokenAndApiKey } from "../../utils/jwt.utils.js";
import { createPaymentPageRequest } from "./payinPageServices.js";

async function paymentPageRoutes(fastify, options) {
   // fastify.addHook('preValidation', validateToken);
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
                    customer_name: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const response = await createPaymentPageRequest(request.body);
        return reply.send(response);
    });
}

export default paymentPageRoutes;

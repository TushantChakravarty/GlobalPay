import { createPaymentPageRequest } from "./payinPageServices.js";

async function paymentPageRoutes(fastify, options) {
    fastify.post('/hostedPage', {
        schema: {
            body: {
                type: 'object',
                required: ['amount'],
                properties: {
                    amount: { type: 'number', minimum: 0.01 },
                }
            }
        }
    }, async (request, reply) => {
        const response = await createPaymentPageRequest(request.body);
        return reply.send(response);
    });
}

export default paymentPageRoutes;

import { bulkpeUpiCollect } from "../../gateways/bulkpe/bulkpe.js";
import { validateTokenAndApiKey } from "../../utils/jwt.utils.js";

async function payinUpiRoutes(fastify, options) {
    
    fastify.addHook('preValidation', validateTokenAndApiKey);
    fastify.post('/upiCollect', {
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
        const response = await bulkpeUpiCollect();
        return reply.send(response);
    });
}

export default payinUpiRoutes;

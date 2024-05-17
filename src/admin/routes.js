import { loginSchema } from "../utils/validationSchemas.js";

import { adminLogin, adminRegister, adminUpdateGateway } from "./adminFacade.js";


async function adminRoutes(fastify, options) {
    fastify.post('/register', {
        schema: {
            body: {
                type: 'object',
                additionalProperties: true
            }
        }
    }, async (request, reply) => {
        const response = await adminRegister(request.body);
        return reply.send(response);
    });
    fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
        try {
            const response = await adminLogin(request.body, fastify);
            // console.log(response)
            if (response?.token)
                return reply.status(200).send(response);
            else
                reply.status(500).send({ message: 'Internal Server Error' });

        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });


    fastify.post('/updategateway', {
        schema: {
            body: {
                type: 'object',
                additionalProperties: true
            }
        }
    }, async (request, reply) => {
        try {
            //1.emailId,apiKey,id
            const response = await adminUpdateGateway(request.body, fastify);
            // console.log(response)
            if (response?.token)
                return reply.status(200).send(response);
            else
                reply.status(500).send({ message: 'Internal Server Error' });

        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });


}



export default adminRoutes;

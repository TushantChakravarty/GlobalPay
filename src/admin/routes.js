import { responseMapping, responseMappingWithData } from "../utils/mapper.js";
import { adminLoginSchema, loginSchema } from "../utils/validationSchemas.js";
import { adminLoginService, adminRegisterService, adminUpdateGatewayService } from "./adminService.js";


async function adminRoutes(fastify, options) {
    fastify.post('/register', {
        schema: {
            body: {
                type: 'object',
                additionalProperties: true
            }
        }
    }, async (request, reply) => {
        const response = await adminRegisterService(request.body);
        return reply.status(200).send(responseMappingWithData(200,'success',
            response
        ));
    });
    fastify.post('/login', { schema: adminLoginSchema }, async (request, reply) => {
        try {
            const response = await adminLoginService(request.body, fastify);
            // console.log(response)
            if (response?.token)
                return reply.status(200).send(responseMappingWithData(200,'success',{
                token:response?.token
            }));
            else
                reply.status(500).send(responseMapping(500,'Internal Server Error'));

        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send(responseMapping(500,'Internal Server Error'));
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
            const response = await adminUpdateGatewayService(request.body, fastify);
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

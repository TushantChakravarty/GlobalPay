import { userRegister } from "./userFacade.js";


async function userRoutes(fastify, options) {
    fastify.post('/register', {
        schema: {
            body: {
                type: 'object',
                additionalProperties:true
            }
        }
    }, async (request, reply) => {
        const response = await userRegister(request.body);
        return reply.send(response);
    });
}



export default userRoutes;

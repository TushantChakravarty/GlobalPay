import { responseMappingWithData, responseMapping } from "../utils/mapper.js";
import { adminLoginSchema, loginSchema } from "../utils/validationSchemas.js";
import { addGateway, adminLoginService, adminRegisterService, adminUpdatePayinGatewayService, adminUpdatePayoutGatewayService, adminUpdateUserPayoutBalanceService, getAllGateway, getPayoutTransactions } from "./adminService.js";
import { validateAdminTokenAndApiKey } from "../utils/jwt.utils.js";


async function adminRoutes(fastify, options) {
    /**
     * admin register routes
     */
    // fastify.post('/register', {
    //     schema: {
    //         body: {
    //             type: 'object',
    //             additionalProperties: true
    //         }
    //     }
    // }, async (request, reply) => {
    //     try{

    //         const response = await adminRegisterService(request.body);
    //         return reply.status(200).send(responseMappingWithData(200,'success',
    //         response
    //         ));
    //     }catch(e)
    //     {
    //         reply.status(500).send(responseMapping(500,'Internal Server Error'));

    //     }
    // });
    /**
  * admin login
  */
    fastify.post('/login', { schema: adminLoginSchema }, async (request, reply) => {
        try {
            const response = await adminLoginService(request.body, fastify);
            // console.log(response)
            if (response?.token)
                return reply.status(200).send(responseMappingWithData(200, 'success', {
                    token: response?.token
                }));
            else
                reply.status(500).send(responseMapping(500, 'Internal Server Error'));

        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
        }
    });

    /**
  * update payin gateway route
  */
    fastify.post('/updatePayinGateway', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    email_Id: { type: "string", format: "email" },
                    gateway: { type: "string" }
                },
                required: ["email_Id", "gateway"]
            }
        },
        preValidation: validateAdminTokenAndApiKey
    }, async (request, reply) => {
        try {
            //1.emailId,apiKey,id
            const response = await adminUpdatePayinGatewayService(request.body, fastify);
            // console.log(response)
            return reply.status(200).send(responseMappingWithData(200, 'success', response));
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
        }
    });
    /**
  * admin payout gateway routes
  */
    fastify.post('/updatePayoutGateway', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    email_Id: { type: "string", format: "email" },
                    gateway: { type: "string" }
                },
                required: ["email_Id", "gateway"]
            }
        },
        preValidation: validateAdminTokenAndApiKey
    }, async (request, reply) => {
        try {
            //1.emailId,apiKey,id
            const response = await adminUpdatePayoutGatewayService(request.body, fastify);
            // console.log(response)
            return reply.status(200).send(responseMappingWithData(200, 'success', response));
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
        }
    });

    /**
     * add gateway route
     */
    fastify.post('/addGateway', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    gatewayName: {
                        type: "string", minLength: 3, maxLength: 50
                    }
                }
            }
        },
        preValidation: validateAdminTokenAndApiKey
    }, async (request, reply) => {
        try {
            const response = await addGateway(request.body, fastify);
            return reply.status(200).send(responseMappingWithData(200, 'success', response));
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
        }
    });

    /**
     * get all gateway route
     */
    fastify.post('/getAllGateway', {
        preValidation: validateAdminTokenAndApiKey
    }, async (request, reply) => {
        try {
            const response = await getAllGateway(request.body, fastify);
            return reply.status(200).send(responseMappingWithData(200, 'success', response));
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
        }
    });

    fastify.get('/getAllPayouts', {
        preValidation: validateAdminTokenAndApiKey
      },
        async (request, reply) => {
          try {
           
            
            const response = await getPayoutTransactions(request)
            return reply.status(200).send(response)
          } catch (error) {
            return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR))
          }
    
        })

        fastify.post('/updateUserPayoutBalance', {
            preValidation: validateAdminTokenAndApiKey
          },
            async (request, reply) => {
              try {
                const response = await adminUpdateUserPayoutBalanceService(request)
                return reply.status(200).send(response)
              } catch (error) {
                return reply.status(500).send(responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR))
              }
        
            })




}



export default adminRoutes;

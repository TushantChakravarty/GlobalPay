import { validateAdminTokenAndApiKey, validateTokenAndApiKey, validateUserDashboardTokenAndApiKey } from "../utils/jwt.utils.js";
import { loginSchema } from "../utils/validationSchemas.js";
import { addPayinCallbackUrl, addPayoutCallbackUrl, getAllPayinTransaction, getAllPayoutTransaction, getPayinTransactionStatus, getPayoutTransactionStatus, userDashboardLoginService, userLoginService, userRegisterService } from "./userService.js";
import { responseMappingWithData, responseMapping } from "../utils/mapper.js";
import commonSchemas from "../utils/common.schemas.js";
import { findUser } from "./userDao.js";

async function userRoutes(fastify, options) {
  /**
   * register user
   */
  fastify.post(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          additionalProperties: true,
        },
      },
      preValidation: validateAdminTokenAndApiKey
    },
    async (request, reply) => {
      try {
        const user = await findUser(request.body.email_id)
        if (user) {
          return reply.status(500).send({
            responseCode: 500,
            responseMessage: "User already exist"
          });
        }
        const response = await userRegisterService(request.body);
        return reply.status(200).send({
          responseCode: 200,
          responseMessage: 'success',
          responseData: {
            email: response?.email,
            password: response?.password,
            apiKey: response?.apiKey,
            encryptionKey: response?.encryptionKey
          }
        });
      } catch (error) {
        return reply.status(500).send({
          responseCode: 500,
          responseMessage: "Internal Server Error"
        });
      }
    }
  );
  /**
  * login user
  */
  fastify.post("/generateToken", { schema: loginSchema }, async (request, reply) => {
    try {
      const response = await userLoginService(request.body, fastify);
      // console.log(response)
      if (response?.token) return reply.status(200).send(response);
      else reply.status(500).send(responseMapping(500, response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });

  fastify.post("/dashboard/login", { schema: loginSchema }, async (request, reply) => {
    try {
      
      const response = await userDashboardLoginService(request.body, fastify);
      console.log(response)
      if (response?.token) return reply.status(200).send(responseMappingWithData(200,'success',response));
      else reply.status(500).send(responseMapping(500, response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  /**
  * add payin callback url
  */
  fastify.post("/addPayinCallbackUrl", {
    schema: {
      body: {
        type: 'object',
        properties: {
          payinCallbackUrl: {
            type: "string", minLength: 3
          }
        },
        required: ["payinCallbackUrl"]

      }
    },
    preValidation: validateTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await addPayinCallbackUrl(request.body, request.user);
      if (response)
        return reply.status(200).send(responseMappingWithData(200, 'success', {
          message: "success"
        }));
      else
        return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  /**
 * add payout callback url
 */
  fastify.post("/addPayoutCallbackUrl", {
    schema: {
      body: {
        type: 'object',
        properties: {
          payoutCallbackUrl: {
            type: "string", minLength: 3
          }
        },
        required: ["payoutCallbackUrl"]
      }
    },
    preValidation: validateTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await addPayoutCallbackUrl(request.body, request.user);
      if (response)
        return reply.status(200).send(responseMappingWithData(200, 'success', {
          message: "success"
        }));
      else
        return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });

  /**
 * get all payin transaction
 */
  fastify.get("/dashboard/getAllPayinTransaction", {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0 },
          limit: { type: 'integer', minimum: 1, maximum: 100 },
        },
        required: ["limit", "skip"]
      },
      response: {
        200: {
          type: 'object',
          properties: {
            responseCode: { type: "integer" },
            responseMessage: { type: "string" },
            responseData: {
              type: 'array',
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  uuid: { type: "integer" },
                  txId: { type: "string" },
                  amount: { type: 'string' },
                  currency: { type: 'string' },
                  status: { type: 'string' },
                  phone: { type: 'string' },
                  username: { type: 'string' },
                  upiId: { type: 'string' },
                  customer_email: { type: 'string' },
                  business_name: { type: 'string' },
                  createdAt: { type: 'string' }
                }

              }
            }
          }
        },
        ...commonSchemas.errorResponse
      },
    },
    preValidation: validateUserDashboardTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getAllPayinTransaction(request, request.user);
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  /**
* get all payout transaction
*/
  fastify.get("/dashboard/getAllPayoutTransaction", {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          skip: { type: 'integer', minimum: 0 },
          limit: { type: 'integer', minimum: 1, maximum: 100 },
        },
        required: ["limit", "skip"]
      },
      response: {
        200: {
          type: 'object',
          properties: {
            responseCode: { type: "integer" },
            responseMessage: { type: "string" },
            responseData: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: "integer" },
                  uuid: { type: "integer" },
                  txId: { type: "string" },
                  amount: { type: 'string' },
                  currency: { type: 'string' },
                  status: { type: 'string' },
                  phone: { type: 'string' },
                  customer_name: { type: 'string' },
                  upiId: { type: 'string' },
                  account_number: { type: 'string' },
                  account_name: { type: 'string' },
                  ifsc_code: { type: 'string' },
                  bank_name: { type: 'string' },
                  customer_email: { type: 'string' },
                  method: { type: 'string' },
                  createdAt: { type: 'string' }

                }

              }
            }
          }
        },
        ...commonSchemas.errorResponse
      }
    },
    preValidation: validateUserDashboardTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getAllPayoutTransaction(request, request.user);
      if (response)
        return reply.status(200).send(responseMappingWithData(200, 'Success', response));
      else
        return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });

  fastify.post("/getPayinStatus", {
    schema: {
      body: {
        type: 'object',
        properties: {
          transaction_id: {
            type: "string", minLength: 3
          }
        },
        required: ["transaction_id"]

      }
    },
    preValidation: validateTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getPayinTransactionStatus(request.body, request.user);
      if (response?.transaction_id)
        return reply.status(200).send(responseMappingWithData(200, 'Success', response));
      else
        return reply.status(500).send(responseMapping(500, response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });

  fastify.post("/getPayoutStatus", {
    schema: {
      body: {
        type: 'object',
        properties: {
          transaction_id: {
            type: "string", minLength: 3
          }
        },
        required: ["transaction_id"]

      }
    },
    preValidation: validateTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getPayoutTransactionStatus(request.body, request.user);
      if (response?.transaction_id)
        return reply.status(200).send(responseMappingWithData(200, 'Success', response));
      else
        return reply.status(500).send(responseMapping(500, response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });

}




export default userRoutes;

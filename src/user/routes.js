import { validateAdminTokenAndApiKey, validateTokenAndApiKey } from "../utils/jwt.utils.js";
import { loginSchema } from "../utils/validationSchemas.js";
import { addPayinCallbackUrl, addPayoutCallbackUrl, getAllPayinTransaction, getAllPayoutTransaction, userLoginService, userRegisterService } from "./userService.js";
import { responseMappingWithData, responseMapping } from "../utils/mapper.js";
import commonSchemas from "../utils/common.schemas.js";

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

        const response = await userRegisterService(request.body);
        return reply.status(200).send({
          responseCode: 200,
          responseMessage: 'success',
          responseData: {
            email: response?.email,
            password: response?.password,
            apiKey: response?.apiKey
          }
        });
      } catch (error) {
        return reply.status(500).send({
          responseCode: 200,
          responseMessage: "Internal Server Error"
        });
      }
    }
  );
  /**
  * login user
  */
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    try {
      const response = await userLoginService(request.body, fastify);
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
  * add payin callback url
  */
  fastify.post("/addPayinCallbackUrl", {
    schema: {
      body: {
        type: 'object',
        properties: {
          payinCallbackUrl: {
            type: "string", minLength: 3, maxLength: 50
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
            type: "string", minLength: 3, maxLength: 50
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
  fastify.get("/getAllPayinTransaction", {
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
          additionalProperties: true
        },
        ...commonSchemas.errorResponse
      },
    },
    preValidation: validateTokenAndApiKey
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
  fastify.get("/getAllPayoutTransaction", {
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
          additionalProperties: true
        },
        ...commonSchemas.errorResponse
      },
    },
    preValidation: validateTokenAndApiKey
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


}




export default userRoutes;

import { responseMappingWithData, responseMapping } from "../utils/mapper.js";
import { adminLoginSchema, loginSchema } from "../utils/validationSchemas.js";
import {
  adminGetPayinStats,
  adminGetPayoutStats,

  adminUpdateUserPayoutBalanceService,
  getAllMerchants,
  getAllPayinTransactions,
  getAllPayoutTransactions,
  getDashboardStats,
  getUsdtRates,
  updateUsdtRate,
  getPayinActiveUsers,
  getPayoutActiveUsers,
  getMerchantPayinData,
  getMerchantPayoutData,
  getMerchantPayinStats
} from "./adminService.js";
import { BanUserPayin, BanUserPayout, addGateway, adminLoginService, adminRegisterService, adminUpdatePayinGatewayService, adminUpdatePayoutGatewayService, getAllGateway, getUsdtRate } from "./adminService.js";
import { validateAdminTokenAndApiKey } from "../utils/jwt.utils.js";
import { CODES, MESSAGES } from "../utils/constants.js";

async function adminRoutes(fastify, options) {
  /**
   * admin register routes
   */
  // fastify.post(
  //   "/register",
  //   {
  //     schema: {
  //       body: {
  //         type: "object",
  //         additionalProperties: true,
  //       },
  //     },
  //   },
  //   async (request, reply) => {
  //     try {
  //       const response = await adminRegisterService(request.body);
  //       return reply
  //         .status(200)
  //         .send(responseMappingWithData(200, "success", response));
  //     } catch (e) {
  //       reply.status(500).send(responseMapping(500, "Internal Server Error"));
  //     }
  //   }
  // );
  /**
   * admin login
   */
  fastify.post(
    "/login",
    { schema: adminLoginSchema },
    async (request, reply) => {
      try {
        const response = await adminLoginService(request.body, fastify);
        // console.log(response)
        if (response?.token)
          return reply.status(200).send(
            responseMappingWithData(200, "success", {
              token: response?.token,
            })
          );
        else
          reply.status(500).send(responseMapping(500, response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  /**
   * update payin gateway route
   */
  fastify.post(
    "/updatePayinGateway",
    {
      schema: {
        body: {
          type: "object",
          // properties: {
          //     email_Id: { type: "string", format: "email" },
          //     gateway: { type: "string" }
          // },
          // required: ["email_Id", "gateway"]
          additionalProperties: true,
        },
      },
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        //1.emailId,apiKey,id
        const response = await adminUpdatePayinGatewayService(
          request.body,
          fastify
        );
        // console.log(response)
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );
  /**
   * admin payout gateway routes
   */
  fastify.post(
    "/updatePayoutGateway",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            email_Id: { type: "string", format: "email" },
            gateway: { type: "string" },
          },
          required: ["email_Id", "gateway"],
        },
      },
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await adminUpdatePayoutGatewayService(request.body, fastify);
        if (!response) {
          return reply.status(500).send(responseMapping(500, 'Gateway already exists'));
        }
        return reply.status(200).send(responseMappingWithData(200, 'success', response));
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
      }
    }
  );
  /**
   * add gateway route
   */
  fastify.post(
    "/addGateway",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            gatewayName: {
              type: "string",
              minLength: 3,
              maxLength: 50,
            },
          },
        },
      },
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await addGateway(request.body, fastify);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  /**
   * get all gateway route
   */
  fastify.get(
    "/getAllGateway",
    {
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await getAllGateway();
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );
  fastify.get(
    "/getAllMerchants",
    {
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await getAllMerchants(request);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  fastify.post(
    "/updateUserPayoutBalance",
    {
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await adminUpdateUserPayoutBalanceService(request);
        return reply.status(200).send(response);
      } catch (error) {
        return reply
          .status(500)
          .send(
            responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR)
          );
      }
    }
  );

  fastify.get(
    "/getAllPayouts",
    {
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await getAllPayoutTransactions(request);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (error) {
        return reply
          .status(500)
          .send(
            responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR)
          );
      }
    }
  );
  /**
   * get all gateway route
   */
  fastify.post('/banUserPayin/:id', {
    preValidation: validateAdminTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await BanUserPayin(request, fastify);
      return reply.status(200).send(responseMappingWithData(200, 'success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });

  /**
 * get all gateway route
 */
  fastify.post('/banUserPayout/:id', {
    preValidation: validateAdminTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await BanUserPayout(request, fastify);
      return reply.status(200).send(responseMappingWithData(200, 'success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });

  fastify.get(
    "/getAllPayins",
    {
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await getAllPayinTransactions(request);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (error) {
        return reply
          .status(500)
          .send(
            responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR)
          );
      }
    }
  );

  fastify.get(
    "/getPayinStats",
    {
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await adminGetPayinStats(request);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (error) {
        return reply
          .status(500)
          .send(
            responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR)
          );
      }
    }
  );

  fastify.get(
    "/getPayoutStats",
    {
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await adminGetPayoutStats(request);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (error) {
        return reply
          .status(500)
          .send(
            responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR)
          );
      }
    }
  );

  fastify.post(
    "/updateUsdtRate",
    {
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await updateUsdtRate(request);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (error) {
        return reply
          .status(500)
          .send(
            responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR)
          );
      }
    }
  );
  fastify.get(
    "/getUsdtRates",
    {
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await getUsdtRates(request);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "success", response));
      } catch (error) {
        return reply
          .status(500)
          .send(
            responseMapping(CODES.INTRNLSRVR, MESSAGES.INTERNAL_SERVER_ERROR)
          );
      }
    }
  );
  fastify.get("/usdtRate", {
    preValidation: validateAdminTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getUsdtRate()
      if (response.usdtRate === null) {
        return reply.status(500).send(responseMapping(500, 'Unable to get usdt rate'));
      }
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  fastify.get("/payoutActiveUsers", {
    preValidation: validateAdminTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getPayoutActiveUsers()
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  fastify.get("/payinActiveUsers", {
    preValidation: validateAdminTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getPayinActiveUsers()
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  fastify.get("/merchantPayoutData/:id", {
    preValidation: validateAdminTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getMerchantPayoutData(request)
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  fastify.get("/merchantPayinData/:id", {
    preValidation: validateAdminTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getMerchantPayinData(request)
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  fastify.get("/getDashboardStats", {
    preValidation: validateAdminTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getDashboardStats()
      if (response.usdtRate === null) {
        return reply.status(500).send(responseMapping(500, 'Unable to get usdt rate'));
      }
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });

  fastify.get("/merchantStats/:id", {
    preValidation: validateAdminTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getMerchantPayinStats(request)
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
}

export default adminRoutes;

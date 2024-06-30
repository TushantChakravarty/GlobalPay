import {
  validateAdminTokenAndApiKey,
  validateTokenAndApiKey,
  validateUserDashboardTokenAndApiKey,
} from "../utils/jwt.utils.js";
import { loginSchema, payinStatsSchema, payoutStatsSchema } from "../utils/validationSchemas.js";
import {
  addPayinCallbackUrl,
  addPayoutCallbackUrl,
  getAllPayinTransaction,
  getAllPayoutTransaction,
  getPayinTransactionStatus,
  getPayoutTransactionStatus,
  registerUserToken,
  userDashboardLoginService,
  userGetPayinStats,
  userGetPayoutStats,
  userLoginService,
  userRegisterService,
  getUsdtRate,
  resetPassword,
  getDashboardStats,
  getAllTransactionDatewise
} from "./userService.js";
import { responseMappingWithData, responseMapping } from "../utils/mapper.js";
import commonSchemas from "../utils/common.schemas.js";
import { findUser } from "./userDao.js";
import { encryptText } from "../utils/password.utils.js";


const tokenizeCard = async (cardDetails) => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  console.log(cardDetails)

  const order_url = 'https://api.razorpay.com/v1/orders'
  const headers1 = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Basic ${basicAuth}`
  });

  const order_data = {
    "amount": 1000000,
    "currency": "INR",
    "receipt": "Receipt no. 1",
    "notes": {
      "notes_key_1": "Tea, Earl Grey, Hot",
      "notes_key_2": "Tea, Earl Grey… decaf."
    }
  }

  const options1 = {
    method: 'POST',
    headers: headers1,
    body: JSON.stringify(order_data)
  };

  const response1 = await fetch(order_url, options1);

  const data = await response1.json()

  cardDetails = { ...cardDetails, order_id: data.id }
  const url = 'https://api.razorpay.com/v1/payments/create/json';
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Basic ${basicAuth}`
  });



  const options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(cardDetails)
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.log(await response.json())
      throw new Error('Tokenization failed');
    }
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error(error);
    throw new Error('Tokenization failed');
  }
};
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
      preValidation: validateAdminTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const user = await findUser(request.body.email_id);
        if (user) {
          return reply.status(500).send({
            responseCode: 500,
            responseMessage: "User already exist",
          });
        }
        const response = await userRegisterService(request.body);
        return reply.status(200).send({
          responseCode: 200,
          responseMessage: "success",
          responseData: {
            email: response?.email,
            password: response?.password,
            apiKey: response?.apiKey,
            encryptionKey: response?.encryptionKey,
          },
        });
      } catch (error) {
        return reply.status(500).send({
          responseCode: 500,
          responseMessage: "Internal Server Error",
        });
      }
    }
  );


  /**
   * login user
   */
  fastify.post(
    "/generateToken",
    { schema: loginSchema },
    async (request, reply) => {
      try {
        const response = await userLoginService(request.body, fastify);
        // console.log(response)
        if (response?.token) return reply.status(200).send(response);
        else reply.status(500).send(responseMapping(500, response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );


  /**
   * add payin callback url
   */
  fastify.post(
    "/addPayinCallbackUrl",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            payinCallbackUrl: {
              type: "string",
              minLength: 3,
            },
          },
          required: ["payinCallbackUrl"],
        },
      },
      preValidation: validateTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await addPayinCallbackUrl(request.body, request.user);
        if (response)
          return reply.status(200).send(
            responseMappingWithData(200, "success", {
              message: "success",
            })
          );
        else
          return reply
            .status(500)
            .send(responseMapping(500, "Internal Server Error"));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );


  /**
   * add payout callback url
   */
  fastify.post(
    "/addPayoutCallbackUrl",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            payoutCallbackUrl: {
              type: "string",
              minLength: 3,
            },
          },
          required: ["payoutCallbackUrl"],
        },
      },
      preValidation: validateTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await addPayoutCallbackUrl(request.body, request.user);
        if (response)
          return reply.status(200).send(
            responseMappingWithData(200, "success", {
              message: "success",
            })
          );
        else
          return reply
            .status(500)
            .send(responseMapping(500, "Internal Server Error"));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  fastify.post(
    "/getPayinStatus",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            transaction_id: {
              type: "string",
              minLength: 3,
            },
          },
          required: ["transaction_id"],
        },
      },
      preValidation: validateTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await getPayinTransactionStatus(
          request.body,
          request.user
        );
        if (response?.transaction_id)
          return reply
            .status(200)
            .send(responseMappingWithData(200, "Success", response));
        else return reply.status(500).send(responseMapping(500, response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  fastify.post(
    "/getPayoutStatus",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            transaction_id: {
              type: "string",
              minLength: 3,
            },
          },
          required: ["transaction_id"],
        },
      },
      preValidation: validateTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await getPayoutTransactionStatus(
          request.body,
          request.user
        );
        if (response?.transaction_id)
          return reply
            .status(200)
            .send(responseMappingWithData(200, "Success", response));
        else return reply.status(500).send(responseMapping(500, response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  fastify.get("/usdtRate", {
    preValidation: validateTokenAndApiKey
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

  // Dashboard routes below**************************************


  fastify.post(
    "/dashboard/login",
    { schema: loginSchema },
    async (request, reply) => {
      try {
        const response = await userDashboardLoginService(request.body, fastify);
        console.log(response);
        if (response?.token)
          return reply
            .status(200)
            .send(responseMappingWithData(200, "success", response));
        else reply.status(500).send(responseMapping(500, response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  fastify.post(
    "/dashboard/registerToken",
    { schema: loginSchema },
    async (request, reply) => {
      try {
        const response = await registerUserToken(request.body, fastify);
        console.log(response);
        if (response?.token)
          return reply
            .status(200)
            .send(responseMappingWithData(200, "success", response));
        else reply.status(500).send(responseMapping(500, response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  fastify.post(
    "/dashboard/addPayinCallbackUrl",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            payinCallbackUrl: {
              type: "string",
              minLength: 3,
            },
          },
          required: ["payinCallbackUrl"],
        },
      },
      preValidation: validateUserDashboardTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await addPayinCallbackUrl(request.body, request.user);
        if (response)
          return reply.status(200).send(
            responseMappingWithData(200, "success", {
              message: "success",
            })
          );
        else
          return reply
            .status(500)
            .send(responseMapping(500, "Internal Server Error"));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  fastify.post(
    "/dashboard/addPayoutCallbackUrl",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            payoutCallbackUrl: {
              type: "string",
              minLength: 3,
            },
          },
          required: ["payoutCallbackUrl"],
        },
      },
      preValidation: validateUserDashboardTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await addPayoutCallbackUrl(request.body, request.user);
        if (response)
          return reply.status(200).send(
            responseMappingWithData(200, "success", {
              message: "success",
            })
          );
        else
          return reply
            .status(500)
            .send(responseMapping(500, "Internal Server Error"));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  /**
   * get all payin transaction
   */
  fastify.get(
    "/dashboard/getAllPayinTransaction",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            skip: { type: "integer", minimum: 0 },
            limit: { type: "integer", minimum: 1, maximum: 100 },
          },
          required: ["limit", "skip"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              responseCode: { type: "integer" },
              responseMessage: { type: "string" },
              responseData: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    uuid: { type: "integer" },
                    txId: { type: "string" },
                    amount: { type: "string" },
                    currency: { type: "string" },
                    status: { type: "string" },
                    phone: { type: "string" },
                    username: { type: "string" },
                    upiId: { type: "string" },
                    customer_email: { type: "string" },
                    transaction_date: { type: "string" },
                    utr: { type: "string" },
                    payout_address: { type: "string" },
                    usdt_rate: { type: "integer" },
                    createdAt: { type: "string" },
                  },
                },
              },
            },
          },
          ...commonSchemas.errorResponse,
        },
      },
      preValidation: validateUserDashboardTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await getAllPayinTransaction(request, request.user);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "Success", response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );
  /**
   * get all payout transaction
   */
  fastify.get(
    "/dashboard/getAllPayoutTransaction",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            skip: { type: "integer", minimum: 0 },
            limit: { type: "integer", minimum: 1, maximum: 100 },
          },
          required: ["limit", "skip"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              responseCode: { type: "integer" },
              responseMessage: { type: "string" },
              responseData: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    uuid: { type: "integer" },
                    txId: { type: "string" },
                    amount: { type: "string" },
                    currency: { type: "string" },
                    status: { type: "string" },
                    phone: { type: "string" },
                    customer_name: { type: "string" },
                    upiId: { type: "string" },
                    account_number: { type: "string" },
                    account_name: { type: "string" },
                    ifsc_code: { type: "string" },
                    bank_name: { type: "string" },
                    customer_email: { type: "string" },
                    method: { type: "string" },
                    transaction_date: { type: "string" },
                    utr: { type: "string" },
                    payout_address: { type: "string" },
                    usdt_rate: { type: "integer" },
                    createdAt: { type: "string" },
                  },
                },
              },
            },
          },
          ...commonSchemas.errorResponse,
        },
      },
      preValidation: validateUserDashboardTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await getAllPayoutTransaction(request, request.user);
        if (response)
          return reply
            .status(200)
            .send(responseMappingWithData(200, "Success", response));
        else
          return reply
            .status(500)
            .send(responseMapping(500, "Internal Server Error"));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  fastify.get(
    "/dashboard/getPayinStats",
    {
      schema: payinStatsSchema,
      preValidation: validateUserDashboardTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await userGetPayinStats(request, request.user);
        return reply
          .status(200)
          .send(responseMappingWithData(200, "Success", response));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );
  /**
   * get all payout transaction
   */
  fastify.get(
    "/dashboard/getPayoutStats",
    {
      schema: payoutStatsSchema,
      preValidation: validateUserDashboardTokenAndApiKey,
    },
    async (request, reply) => {
      try {
        const response = await userGetPayoutStats(request, request.user);
        if (response)
          return reply
            .status(200)
            .send(responseMappingWithData(200, "Success", response));
        else
          return reply
            .status(500)
            .send(responseMapping(500, "Internal Server Error"));
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send(responseMapping(500, "Internal Server Error"));
      }
    }
  );

  fastify.get("/dashboard/profile", {
    preValidation: validateUserDashboardTokenAndApiKey
  }, async (request, reply) => {
    try {
      const encrytedKey = encryptText(request?.user?.apiKey);

      const response = {
        business_name: request.user.business_name,
        name: `${request.user.first_name} ${request.user.last_name}`,
        email: request?.user?.email_id,
        apiKey: encrytedKey,
        encryptionKey: request?.user?.encryptionKey,
        payinCallbackUrl: request?.user?.callbackUrl,
        payoutCallbackUrl: request?.user?.payoutCallbackUrl
      }
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  fastify.get("/dashboard/stats", {
    preValidation: validateUserDashboardTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getDashboardStats(request)
      if (response.usdtRate === null) {
        return reply.status(500).send(responseMapping(500, 'Unable to get usdt rate'));
      }
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });
  // fastify.get("/usdtRate", {
  //   preValidation: validateTokenAndApiKey
  // }, async (request, reply) => {
  //   try {
  //     const response = await getUsdtRate()
  //     if (response.usdtRate === null) {
  //       return reply.status(500).send(responseMapping(500, 'Unable to get usdt rate'));
  //     }
  //     return reply.status(200).send(responseMappingWithData(200, 'Success', response));
  //   } catch (err) {
  //     fastify.log.error(err);
  //     return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
  //   }
  // });
  fastify.post("/dashboard/resetPassword", {
    schema: {
      body: {
        type: "object",
        properties: {
          old_password: { type: "string" },
          new_password: { type: "string" },
        },
        required: ["old_password", "new_password"],
        additionalProperties: true
      },
    },
    preValidation: validateUserDashboardTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await resetPassword(request.body, request.user)
      if (response === "Success") {
        return reply.status(200).send(responseMappingWithData(200, 'Success', response));
      }
      return reply.status(500).send(responseMapping(500, response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });

  fastify.post("/dashboard/getAllTransactionDatewise", {
    preValidation: validateUserDashboardTokenAndApiKey
  }, async (request, reply) => {
    try {
      const response = await getAllTransactionDatewise(request)
      return reply.status(200).send(responseMappingWithData(200, 'Success', response));
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send(responseMapping(500, 'Internal Server Error'));
    }
  });


  fastify.post('/tokenize', async (req, res) => {
    try {
      const token = await tokenizeCard(req.body);
      console.log(token)
      res.send({ token });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });



}

export default userRoutes;

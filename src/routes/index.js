import paymentPageRoutes from "../payin/paymentPage/payinPageRoutes.js";
import payinUpiRoutes from "../payin/upi/payinRoutes.js";
import userRoutes from "../user/routes.js";
import fastifyJwt from "fastify-jwt";
import adminRoutes from "../admin/routes.js";
import payoutBankRoutes from "../payout/bank/routes.js";
import callbackRoutes from "../callbacks/routes.js";

const registerRoutes = (fastify) => {
  fastify.register(require('@fastify/cors'), { 
    // put your options here
    origin: '*', // allow all origins
    methods: ['GET', 'PUT', 'POST', 'DELETE'], // allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // allow these headers
  });
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });
  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
  fastify.register(payoutBankRoutes,{ prefix: "/payout" });
  fastify.register(payinUpiRoutes, { prefix: "/payin/upi" });
  fastify.register(paymentPageRoutes, { prefix: "/payin/hosted" });
  fastify.register(userRoutes, { prefix: "/user" });
  fastify.register(adminRoutes, { prefix: "/admin" });
  fastify.register(callbackRoutes, { prefix: "/callback" });

};

export default registerRoutes;

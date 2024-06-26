import paymentPageRoutes from "../payin/paymentPage/payinPageRoutes.js";
import payinUpiRoutes from "../payin/upi/payinRoutes.js";
import userRoutes from "../user/routes.js";
import fastifyJwt from "fastify-jwt";
import adminRoutes from "../admin/routes.js";
import callbackRoutes from "../callbacks/routes.js";
import payoutRoutes from "../payout/routes.js";

const registerRoutes = (fastify) => {
  
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
  fastify.register(payoutRoutes,{ prefix: "/payout" });
  fastify.register(payinUpiRoutes, { prefix: "/payin/upi" });
  fastify.register(paymentPageRoutes, { prefix: "/payin/hosted" });
  fastify.register(userRoutes, { prefix: "/user" });
  fastify.register(adminRoutes, { prefix: "/admin" });
  fastify.register(callbackRoutes, { prefix: "/callback" });

};

export default registerRoutes;

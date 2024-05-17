import paymentPageRoutes from "../payin/paymentPage/payinPageRoutes.js";
import payinUpiRoutes from "../payin/upi/payinRoutes.js";
import neftRoutes from "../payout/neft/routes.js";
import userRoutes from "../user/routes.js";
import fastifyJwt from "fastify-jwt";

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
  fastify.register(neftRoutes);
  fastify.register(payinUpiRoutes, { prefix: "/payin/upi" });
  fastify.register(paymentPageRoutes, { prefix: "/payin/hosted" });
  fastify.register(userRoutes, { prefix: "/user" });
};

export default registerRoutes;

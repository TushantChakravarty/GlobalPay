import { loginSchema } from "../utils/validationSchemas.js";
import { userLoginService, userRegisterService } from "./userService.js";

async function userRoutes(fastify, options) {
  fastify.post(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          additionalProperties: true,
        },
      },
    },
    async (request, reply) => {
      const response = await userRegisterService(request.body);
      return reply.send(response);
    }
  );
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    try {
      const response = await userLoginService(request.body, fastify);
      // console.log(response)
      if (response?.token) return reply.status(200).send(response);
      else reply.status(500).send({ message: "Internal Server Error" });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

export default userRoutes;

import { loginSchema } from "../utils/validationSchemas.js";
import { userLogin, userRegister } from "./userFacade.js";

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
      const response = await userRegister(request.body);
      return reply.send(response);
    }
  );
  fastify.post("/login", { schema: loginSchema }, async (request, reply) => {
    try {
      const response = await userLogin(request.body, fastify);
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

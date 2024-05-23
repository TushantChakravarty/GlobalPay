import { validateApiKey } from "./password.utils.js";

export async function generateUserToken(details, fastify) {
  const { email_id } = details;
  const token = fastify.jwt.sign({ email_id });
  return token;
}

export async function generateAdminToken(details, fastify) {
  const { email_id } = details;
  const token = fastify.jwt.sign({ email_id });
  return token;
}

export const validateToken = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    console.log(err);
    reply.status(401).send({ message: "invalid token" });
  }
};

export const validateTokenAndApiKey = async (request, reply) => {
  await validateToken(request, reply);
  await validateApiKey(request, reply);
};

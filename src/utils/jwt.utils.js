import { responseMapping } from "./mapper.js";
import { validateAdminApiKey, validateApiKey } from "./password.utils.js";

export async function generateUserToken(details, fastify) {
  const { email_id } = details;
  const token = fastify.jwt.sign({ email_id }, { expiresIn: '1h' });
  return token;
}

export async function generateAdminToken(details, fastify) {
  const { email_id } = details;
  const token = fastify.jwt.sign({ email_id }, { expiresIn: '30d' });
  return token;
}

export const validateToken = async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    console.log(err);
    reply.status(403).send(responseMapping(403,'Your session expired'));
  }
};

export const validateTokenAndApiKey = async (request, reply) => {
  console.log(request.headers)
  if(!request.headers.authorization)
  {
    return reply.status(403).send(responseMapping(403,'Token is required'));

  }
  if(!request.headers.apikey)
  {
    return reply.status(403).send(responseMapping(403,'Apikey is required'));

  }
  await validateToken(request, reply);
  await validateApiKey(request, reply);
};

export const validateAdminTokenAndApiKey = async (request, reply) => {
  //console.log(request.headers)
  if(!request.headers.Authorization)
  {
    return reply.status(403).send(responseMapping(403,'Token is required'));

  }
  if(!request.headers.apikey)
  {
    return reply.status(403).send(responseMapping(403,'Apikey is required'));

  }
  await validateToken(request, reply);
  await validateAdminApiKey(request, reply);
};

import { validateApiKey } from "./password.utils.js";

export async function generateUserToken(details,fastify)
{
    const { email_id} = details
    const token = fastify.jwt.sign({ email_id });
    return token 
}

export const validateToken = async (request, reply) => {
    try {
     const validated =  await request.jwtVerify();
     console.log('validated',validated)
     return validated
    } catch (err) {
        console.log(err)
      reply.status(401).send({message:'invalid token'});
    }
  };

  export const validateTokenAndApiKey = async (request, reply) => {
   const validated = await validateToken(request, reply);
   if(validated)
    await validateApiKey(request, reply);
   else
   reply.status(401).send({message:'invalid token'});
  };
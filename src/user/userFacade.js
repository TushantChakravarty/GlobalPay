//import { neftYesbank } from "../../gateways/yesbank/neftServiceYesbank.js";

import { userLoginService, userRegisterService } from "./userService.js";

export async function userRegister(body) {
  // const response = await neftYesbank();
  const response = await userRegisterService(body)
  return response;
}

export async function userLogin(body,fastify)
{
  const response = await userLoginService(body,fastify)
  return response;
}
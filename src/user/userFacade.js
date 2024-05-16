//import { neftYesbank } from "../../gateways/yesbank/neftServiceYesbank.js";

import { userRegisterService } from "./userService.js";

export async function userRegister(body) {
  // const response = await neftYesbank();
  const response = await userRegisterService(body)
  return response;
}

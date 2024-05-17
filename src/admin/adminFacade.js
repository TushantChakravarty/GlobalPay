import { adminLoginService, adminRegisterService, adminUpdateGatewayService } from "./adminService.js";

export async function adminRegister(body) {
    // const response = await neftYesbank();
    const response = await adminRegisterService(body)
    return response;
}

export async function adminLogin(body, fastify) {
    const response = await adminLoginService(body, fastify)
    return response;
}

export async function adminUpdateGateway(body, fastify) {
    const response = await adminUpdateGatewayService(body, fastify)
    return response;
}
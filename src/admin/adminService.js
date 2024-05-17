import { generateUserToken } from "../utils/jwt.utils.js";
import { generatePassword, convertPass, encryptText } from "../utils/password.utils.js";
import { createAdmin, findAdmin } from "./adminDao.js";
import bcrypt from 'bcryptjs';

import db from "../db/index.js";

const { Admin, User } = db


export async function adminRegisterService(details) {
    try {
        let password = generatePassword(
            20,
            "123456789abcdefghijklmnopqrstuvwxyz"
        );


        let convertedPass = await convertPass(password);

        details.password = convertedPass;
        const apiKey = Math.random().toString(36).slice(2);
        const encrytedKey = encryptText(apiKey);
        console.log("encrypted key", encrytedKey);
        details.apiKey = apiKey;
        details.balance = 0;
        const createdAdmin = await createAdmin(details)
        let responseData = {}
        if (createUser) {
            responseData = {
                email: createdAdmin.emailId,
                password: password,
                apiKey: encrytedKey,
            };
        }

        return responseData;

    } catch (err) {
        console.log("adminRegisterService", err)

    }

}


export async function adminLoginService(details, fastify) {
    const { emailId, password } = details
    const admin = await findAdmin(emailId)

    if (admin && await bcrypt.compare(password, admin.password)) {
        const token = await generateUserToken(emailId, fastify)
        await admin.update({ token }, { where: { emailId } });
        return { token }
    }

    return { message: 'Invalid email or password' }
}

export async function adminUpdateGatewayService(details, fastify) {

    const { email_Id, apiKey, gateway } = details
    const user = await User.findOne({ where: { email_Id: email_Id, apiKey: apiKey } })
    if (!user) {
        return { message: 'User not exist' }
    }
    user.gateway = gateway
    await user.save()

    return { message: 'Success' }
}
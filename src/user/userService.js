import { generateAdminToken, generateUserToken } from "../utils/jwt.utils.js";
import { generatePassword, convertPass, encryptText } from "../utils/password.utils.js";
import { createUser, findUser } from "./userDao.js";
import bcrypt from 'bcryptjs';
import db from "../db/index.js";

const { User } = db


export async function userRegisterService(details) {
  try {
    let password = generatePassword(
      20,
      "123456789abcdefghijklmnopqrstuvwxyz"
    );


    let convertedPass = await convertPass(password);

    details.password = convertedPass;
    const apiKey = Math.random().toString(36).slice(2);
    console.log(apiKey);

    const encrytedKey = encryptText(apiKey);
    console.log("encrypted key", encrytedKey);
    details.apiKey = apiKey;
    details.balance = 0;
    const createdUser = await createUser(details)
    let responseData = {}
    if (createUser) {
      responseData = {
        email: createdUser.email_id,
        password: password,
        apiKey: encrytedKey,
      };
    }

    return responseData;

  } catch (err) {
    console.log("userRegisterService", err)
    throw new Error("Internal server error")

  }

}


export async function userLoginService(details, fastify) {
  try {
    const { email_id, password } = details
    const user = await findUser(email_id)

    if (user && await bcrypt.compare(password, user.password)) {
      const token = await generateUserToken(email_id, fastify)
      await user.update({ token }, { where: { email_id } });
      return { token }
    }
    return { message: 'Invalid email or password' }
  } catch (error) {
    throw new Error("Internal server error")
  }
}

export async function addPayinCallbackUrl(details, user) {
  try {
    const user = await User.findOne({ where: { id: user.id } })
    user.callbackUrl = details.payinCallbackUrl
    await user.save()
    return user
  } catch (error) {
    throw new Error("Internal server error")
  }
}

export async function addPayoutCallbackUrl(details, user) {
  try {
    const user = await User.findOne({ where: { id: user.id } })
    user.payoutCallbackUrl = details.payoutCallbackUrl
    await user.save()
    return user
  } catch (error) {
    throw new Error("Intenal server error")
  }
}
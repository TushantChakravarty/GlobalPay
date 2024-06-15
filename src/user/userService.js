import { generateAdminToken, generateUserToken } from "../utils/jwt.utils.js";
import { generatePassword, convertPass, encryptText } from "../utils/password.utils.js";
import { createUser, findUser } from "./userDao.js";
import bcrypt from 'bcryptjs';
import db from "../db/index.js";
import { responseMapping, responseMappingWithData } from "../utils/mapper.js";

const { User, Transaction, PayoutTransaction } = db


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
    if (createdUser) {
      responseData = {
        email: createdUser.email_id,
        password: password,
        apiKey: encrytedKey,
        encryptionKey: createdUser.encryptionKey
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
    const new_user = await User.findOne({ where: { id: user.id } })
    new_user.callbackUrl = details.payinCallbackUrl
    await new_user.save()
    return new_user
  } catch (error) {
    console.log(error)
    throw new Error("Internal server error")
  }
}

export async function addPayoutCallbackUrl(details, user) {
  try {
    const new_user = await User.findOne({ where: { id: user.id } })
    new_user.payoutCallbackUrl = details.payoutCallbackUrl
    await new_user.save()
    return new_user
  } catch (error) {
    throw new Error("Intenal server error")
  }
}


export async function getAllPayinTransaction(details, user) {
  try {
    const { limit = 10, skip = 0 } = details.query
    const all_payin_transaction = await Transaction.findAll({
      where: {
        uuid: parseInt(user.id)
      },
      limit: limit,
      offset: skip,
      order: [['createdAt', 'ASC']]
    })
    return all_payin_transaction
  } catch (error) {
    console.log(error)
    throw new Error("Internal server error")
  }
}

export async function getAllPayoutTransaction(details, user) {
  try {
    const { limit = 10, skip = 0 } = details.query
    const all_payout_transaction = await PayoutTransaction.findAll({
      where: {
        uuid: parseInt(user.id)
      },
      limit: limit,
      offset: skip,
      order: [['createdAt', 'ASC']]
    })
    return all_payout_transaction
  } catch (error) {
    throw new Error("Internal server error")
  }
}

export async function getPayinTransactionStatus(details, user) {
  try {
    const transaction = await Transaction.findOne({
      where: { uuid: user.id, transactionId: details?.transaction_id }
    })
    if (!transaction) {
      return 'Transaction not found';
    }
    return {
      transaction_id: transaction?.transactionId,
      status: transaction?.status
    }
  } catch (error) {
    console.log(error)
    throw new Error("Intenal server error")
  }
}

export async function getPayoutTransactionStatus(details, user) {
  try {
    const transaction = await PayoutTransaction.findOne({
      where: { uuid: user.id, transactionId: details?.transaction_id }
    })
    console.log(transaction)
    if (!transaction) {
      return 'Transaction not found';
    }
    return {
      transaction_id: transaction?.transactionId,
      status: transaction?.status
    }
  } catch (error) {
    console.log(error)
    throw new Error("Intenal server error")
  }
}

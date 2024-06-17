import { generateAdminToken, generateUserDashboardToken, generateUserToken } from "../utils/jwt.utils.js";
import { generatePassword, convertPass, encryptText, encryptApiKey } from "../utils/password.utils.js";
import { createUser, findUser } from "./userDao.js";
import bcrypt from 'bcryptjs';
import db from "../db/index.js";
import { responseMapping, responseMappingWithData } from "../utils/mapper.js";
import { fetchWithAuth } from "../utils/utils.js";

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
      //const apiKey = encryptApiKey(user.apiKey,user.encryptionKey);
      await user.update({ token }, { where: { email_id } });
      return { token }
    }
    return  'Invalid email or password' 
  } catch (error) {
    throw new Error("Internal server error")
  }
}

export async function userDashboardLoginService(details, fastify) {
  try {
    const { email_id, password } = details
    const user = await findUser(email_id)

    if (user && await bcrypt.compare(password, user.password)) {
      const token = await generateUserDashboardToken(email_id, fastify)
      const apiKey = encryptApiKey(user.apiKey,user.encryptionKey);
      await user.update({ token }, { where: { email_id } });
      //fetchWithAuth(`${process.env.url}/user/dashboard/registerToken`,'POST',email_id,password,token)
      return { token, apiKey }
    }
    return 'Invalid email or password' 
  } catch (error) {
    throw new Error("Internal server error")
  }
}

export async function registerUserToken(details, fastify) {
  try {
    const { email_id, password } = details
    const user = await findUser(email_id)

    if (user && await bcrypt.compare(password, user.password)) {
      //const token = await generateUserDashboardToken(email_id, fastify)
      const apiKey = encryptApiKey(user.apiKey,user.encryptionKey);
      await user.update({ token:details.token }, { where: { email_id } });
      fetchWithAuth(`${process.env.url}/user/dashboard/login`,'POST',email_id,password)
      return { token, apiKey }
    }
    return 'Invalid email or password' 
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

export async function userGetPayinStats(details, fastify) {
  try {
    const user = details.user;
    if (!user) {
      return "User not exist";
    }
    const data = {
      balance: user.balance,
      last24hr: user.last24hr,
      yesterday: user.yesterday,
      successfulTransactions: user.successfulTransactions,
      last24hrSuccess: user.last24hrSuccess,
      last24hrTotal: user.last24hrTotal,
      totalTransactions: user.totalTransactions,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}

export async function userGetPayoutStats(details, fastify) {
  try {
    const user = details.user;
    if (!user) {
      return "User not exist";
    }
    const data = {
      balance: user.payoutBalance,
      last24hr: user.payoutsData.last24hr,
      yesterday: user.payoutsData.yesterday,
      successfulTransactions: user.payoutsData.successfulTransactions,
      last24hrSuccess: user.payoutsData.last24hrSuccess,
      last24hrTotal: user.payoutsData.last24hrTotal,
      totalTransactions: user.payoutsData.totalTransactions,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}


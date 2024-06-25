import { generateAdminToken, generateUserToken } from "../utils/jwt.utils.js";
import {
  generatePassword,
  convertPass,
  encryptText,
} from "../utils/password.utils.js";
import { createAdmin, findAdmin, updateAdminUsdtRate } from "./adminDao.js";
import bcrypt from "bcryptjs";

import db from "../db/index.js";

const { Admin, User, Gateway, PayoutTransaction, Transaction, UsdtRate } = db;

export async function adminRegisterService(details) {
  try {
    let password = generatePassword(20, "123456789abcdefghijklmnopqrstuvwxyz");

    let convertedPass = await convertPass(password);

    details.password = convertedPass;
    const apiKey = Math.random().toString(36).slice(2);
    const encrytedKey = encryptText(apiKey);
    console.log("encrypted key", encrytedKey);
    details.apiKey = apiKey;
    details.balance = 0;
    const createdAdmin = await createAdmin(details);
    let responseData = {};
    if (createdAdmin) {
      responseData = {
        email: createdAdmin.emailId,
        password: password,
        apiKey: encrytedKey,
      };
    }

    return responseData;
  } catch (err) {
    console.log("adminRegisterService", err);
  }
}

export async function adminLoginService(details, fastify) {
  const { emailId, password } = details;
  const admin = await findAdmin(emailId);

  if (admin && (await bcrypt.compare(password, admin.password))) {
    const token = await generateAdminToken(emailId, fastify);
    await admin.update({ token }, { where: { emailId } });
    return { token };
  }

  return "Invalid email or password"
}

/**
 * this service is to update payin gateway
 * @param {*} details
 * @param {*} fastify
 * @returns
 */
export async function adminUpdatePayinGatewayService(details, fastify) {
  try {
    const { email_Id, apiKey, gateway } = details;
    const user = await User.findOne({ where: { email_id: email_Id } });
    if (!user) {
      return { message: "User not exist" };
    }
    user.gateway = gateway;
    await user.save();
    return { message: "Success" };
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}
/**
 * This service to update payout gateway
 * @param {*} details
 * @param {*} fastify
 * @returns
 */
export async function adminUpdatePayoutGatewayService(details, fastify) {
  try {
    const { email_Id, gateway } = details;
    const user = await User.findOne({ where: { email_id: email_Id } });
    if (!user) {
      return { message: "User not exist" };
    }
    user.payoutGateway = gateway;
    await user.save();

    return { message: "Success" };
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}

/**
 * add gateway service
 */
export async function addGateway(details) {
  try {
    const gateway_exist = await Gateway.findOne({ where: { gatewayName: details.gatewayName } })
    if (gateway_exist) {
      return false
    }
    const gateway = await Gateway.create({
      gatewayName: details.gatewayName,
      abbr: details?.abbr
    })
    return gateway

  } catch (error) {
    throw new Error("Internal server error")
  }
}

/**
 * get all gateway service
 */
export async function getAllGateway() {
  try {
    const gateway = await Gateway.findAll();
    return gateway;
  } catch (error) {
    throw new Error("Internal server error");
  }
}

export async function adminUpdateUserPayoutBalanceService(details, fastify) {
  try {
    const { email_Id, amount } = details;
    const user = await User.findOne({ where: { email_id: email_Id } });
    if (!user) {
      return { message: "User not exist" };
    }
    user.payoutBalance = user.payoutBalance + amount;
    await user.save();

    return { message: "Success" };
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}

export async function getAllPayoutTransactions(details) {
  const { limit = 10, skip = 0 } = details.query;
  const response = await PayoutTransaction.findAll({
    limit: limit,
    offset: skip,
    order: [['createdAt', 'DESC']],
  });
  if (response) return response;
  else return [];
}
export async function getAllPayinTransactions(details) {
  const { limit = 10, skip = 0 } = details.query;
  const response = await Transaction.findAll({
    limit: limit,
    offset: skip,
    order: [['createdAt', 'DESC']],
  });
  if (response) return response;
  else return [];
}

export async function getAllMerchants(details) {
  const { limit = 10, skip = 0 } = details.query;
  try {
    const response = await User.findAll({
      limit: limit,
      offset: skip,
      order: [['createdAt', 'ASC']], // Change 'ASC' to 'DESC' for descending order
    });
    if (response.length > 0) {
      return response;
    } else {
      return [];
    }
  } catch (error) {
    return `Error fetching users: ${error.message}`;
  }
}

export async function adminGetPayinStats(details, fastify) {
  try {
    const user = details.user;
    if (!user) {
      return "User not exist";
    }
    const data = {
      balance: user.balance,
      last24hr: user.last24hr,
      yesterday: user.yesterday,
      totalVolume: user.totalVolume,
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

export async function adminGetPayoutStats(details, fastify) {
  try {
    const user = details.user;
    if (!user) {
      return "User not exist";
    }
    const data = {
      balance: user.payoutsBalance,
      last24hr: user.payouts.last24hr,
      yesterday: user.payouts.yesterday,
      successfulTransactions: user.payouts.successfulTransactions,
      last24hrSuccess: user.payouts.last24hrSuccess,
      last24hrTotal: user.payouts.last24hrTotal,
      totalTransactions: user.payouts.totalTransactions,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}


/**
 * Ban user payin
 */
export async function BanUserPayin(request) {
  try {
    const { id } = request.params
    const { isBanned } = request.body
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
      return "User not exist";
    }
    user.isBanned = isBanned
    await user.save()
    return 'success'
  } catch (error) {
    throw new Error("Internal server error")
  }
}

/**
 * Ban user payin
 */
export async function BanUserPayout(request) {
  try {
    const { id } = request.params
    const { payoutsActive } = request.body
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
      return "User not exist";
    }
    user.payoutsActive = payoutsActive
    await user.save()
    return 'success'
  } catch (error) {
    throw new Error("Internal server error")
  }
}

export async function updateUsdtRate(request) {
  try {
    const { usdtRate, notes } = request.body
    const admin = await Admin.findOne({ where: { id: request.user.id } })
    if (!admin) {
      return "User not exist";
    }
    const now = Date.now();

    admin.usdtRate = usdtRate
    await updateAdminUsdtRate({
      usdtRate,
      date: now.toString(),
      notes: notes
    })
    await admin.save()
    return 'success'
  } catch (error) {
    console.log('update usdt service', error)
    throw new Error("Internal server error")
  }
}

export async function getUsdtRates(request) {
  try {
    const { limit, skip } = request.query
    const rates = await UsdtRate.findAll({
      limit: limit,
      offset: skip,
      order: [['createdAt', 'DESC']],
    })
    return rates
  } catch (error) {
    console.log('get usdt service', error)
    throw new Error("Internal server error")
  }
}

export async function getUsdtRate() {
  try {
    const admin = await Admin.findOne({ where: { emailId: "info@gsxsolutions.com" } })
    if (!admin) {
      return { usdtRate: null }
    }
    return { usdtRate: admin?.usdtRate }
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}



export async function getPayinActiveUsers() {
  try {
    const active_users = await User.findAll({
      where: { isBanned: false },
      attributes: ['id', 'business_name']
    })
    return active_users
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}

export async function getPayoutActiveUsers() {
  try {
    const active_users = await User.findAll({ where: { payoutsActive: false }, attributes: ['id', 'business_name'] })
    return active_users
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}


export async function getMerchantPayoutData(details) {
  try {
    const id = details.params.id
    const all_payout = PayoutTransaction.findAll({ where: { uuid: parseInt(id) } })
    return all_payout
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}


export async function getMerchantPayinData(details) {
  try {
    const id = details.params.id
    const all_payin_transaction = Transaction.findAll({ where: { uuid: parseInt(id) } })
    return all_payin_transaction
  } catch (error) {
    console.log(error);
    throw new Error("Internal server error");
  }
}

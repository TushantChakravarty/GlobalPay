import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import { findUser, findUserByApiKey, findUserByToken } from "../user/userDao.js";
import { findAdminByApiKey } from "../admin/adminDao.js";
import { responseMapping } from "./mapper.js";
export function generatePassword(len, arr) {
  let ans = "";
  for (let i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  console.log(ans);
  return ans;
}

export async function convertPass(password) {
  let pass = await bcrypt.hash(password, 10);
  // req.body.password = pass;
  return pass;
}

export function encryptText(input) {
  var ciphertext = CryptoJS.AES.encrypt(
    input,
    process.env.SECRETKEY
  ).toString();
  console.log(ciphertext);
  return ciphertext;
}
export function encryptApiKey(input,secret) {
  var ciphertext = CryptoJS.AES.encrypt(
    input,
    secret
  ).toString();
  console.log(ciphertext);
  return ciphertext;
}

export function decryptApiKey(input,secret) {
  var bytes = CryptoJS.AES.decrypt(input, secret);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  console.log(originalText)
  return originalText

}
export function decryptText(input) {
  var bytes = CryptoJS.AES.decrypt(input, process.env.SECRETKEY);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  console.log(originalText)
  return originalText

}

export const validateApiKey = async (request, reply) => {
  const apiKey = request.headers["apikey"];
  console.log("apiKey", apiKey);
  if (!apiKey) {
    return reply.status(401).send(responseMapping( 400,"Api Key is required" ));
  }

  try {
    var bytes = CryptoJS.AES.decrypt(apiKey, process.env.SECRETKEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalText);
    if (!originalText) {
      return reply.status(401).send(responseMapping( 403,"Invalid API key" ));
    }
    const user = await findUserByApiKey(originalText);
    //console.log('userr',user);
    if (!user) {
      return reply.status(401).send(responseMapping( 400,"User Does Not exist" ));
    }
    if (user?.apiKey == originalText) {
      request.apiKeyDetails = originalText;
    } else {
      return reply.status(401).send(responseMapping( 403,"Invalid API key" ));
    }
    request.user = user
    // You can perform additional checks here if needed
    // Storing the decrypted details in request for further use
  } catch (error) {
    return reply.status(401).send(responseMapping( 400,"Invalid API key" ));
  }
};

export const validateUserDashboardApiKey = async (request, reply) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];
  const apiKey = request.headers["apikey"]
  //console.log("token", token);
  if (!token) {
    return reply.status(401).send(responseMapping( 403,"token is required" ));
  }

  try {
    const user = await findUserByToken(token)

    if (!user) {
      return reply.status(401).send(responseMapping( 403,"Your session expired" ));
    }
    
    var originalText = decryptText(apiKey)
    //console.log("here",originalText==user?.apiKey);
    if (!originalText) {
      return reply.status(401).send(responseMapping( 403,"Invalid API key" ));
    }
    if (user?.apiKey == originalText) {
      request.apiKeyDetails = originalText;
    } else {
      return reply.status(401).send(responseMapping( 403,"Invalid API key" ));
    }
    request.user = user
    request.token = token
    request.apiKey = apiKey
    // You can perform additional checks here if needed
    // Storing the decrypted details in request for further use
  } catch (error) {
    return reply.status(401).send(responseMapping( 400,"Invalid API key" ));
  }
};

export const validateAdminApiKey = async (request, reply) => {
  const apiKey = request.headers["apikey"];
  console.log("apiKey", apiKey);
  if (!apiKey) {
    return reply.status(401).send(responseMapping( 400,"Missing API key" ));
  }

  try {
    var bytes = CryptoJS.AES.decrypt(apiKey, process.env.SECRETKEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalText);
    if (!originalText) {
      return reply.status(401).send(responseMapping( 400,"Invalid API key" ));
    }
    const user = await findAdminByApiKey(originalText);
    //console.log('userr',user);
    if (!user) {
      return reply.status(401).send(responseMapping( 400,"User Does not exist" ));
    }
    if (user?.apiKey == originalText) {
      //console.log(user?.apiKey == originalText)
      request.apiKeyDetails = originalText;
      request.user = user

    } else {
      return reply.status(401).send(responseMapping( 400,"Invalid API key" ));
    }
    // You can perform additional checks here if needed
    // Storing the decrypted details in request for further use
  } catch (error) {
    return reply.status(401).send(responseMapping( 400,"Invalid API key" ));
  }
};

export function generateTransactionId(length) {
  //console.log('ran')
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let transactionId = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    transactionId += characters.charAt(randomIndex);
  }
  // console.log(transactionId)
  return transactionId;
}
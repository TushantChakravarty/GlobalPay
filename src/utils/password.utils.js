import bcrypt from "bcryptjs"
import CryptoJS from 'crypto-js';
import { findUser } from "../user/userDao.js";
export function generatePassword(len, arr) {
  let ans = '';
  for (let i = len; i > 0; i--) {
    ans +=
      arr[(Math.floor(Math.random() * arr.length))];
  }
  console.log(ans);
  return ans
}

export async function convertPass(password) {
  let pass = await bcrypt.hash(password, 10)
  // req.body.password = pass;
  return pass
}

export function encryptText(input) {
  var ciphertext = CryptoJS.AES.encrypt(input, process.env.SECRETKEY).toString();
  console.log(ciphertext)
  return ciphertext

}

export const validateApiKey = async (request, reply) => {
  const apiKey = request.headers['apikey'];
  console.log('apiKey',apiKey)
  if (!apiKey) {
    return reply.status(401).send({ message: 'Missing API key' });
  }

  try {
    var bytes = CryptoJS.AES.decrypt(apiKey, process.env.SECRETKEY);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalText)
    if (!originalText) {
      return reply.status(401).send({ message: 'Invalid API key' });
    }
    const user = await findUser(request?.body?.email_id)
    console.log(user)
    if(!user)
    {
      return reply.status(401).send({ message: 'Invalid User' });
    }
    if(user?.apiKey == originalText)
    {
      //console.log(user?.apiKey == originalText)
      request.apiKeyDetails = originalText;
    }else{
      return reply.status(401).send({ message: 'Invalid API key' });

    }
    // You can perform additional checks here if needed
    // Storing the decrypted details in request for further use
  } catch (error) {
    return reply.status(401).send({ message: 'Invalid API key' });
  }
};
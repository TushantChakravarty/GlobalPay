import bcrypt from "bcryptjs"
import CryptoJS from 'crypto-js';
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
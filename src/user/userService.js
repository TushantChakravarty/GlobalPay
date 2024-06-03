import User from "../db/user/user.model.js";
import { generateAdminToken, generateUserToken } from "../utils/jwt.utils.js";
import { generatePassword,convertPass,encryptText } from "../utils/password.utils.js";
import { createUser, findUser } from "./userDao.js";
import bcrypt from 'bcryptjs';


export async function userRegisterService(details) {
  try{
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
                  let responseData ={}
                  if(createUser){
                    responseData = {
                      email: createdUser.email_id,
                      password: password,
                      apiKey: encrytedKey,
                    };
                  }
  
    return responseData;

  }catch(err){
    console.log("userRegisterService",err)

  }
  
}


export async function userLoginService(details,fastify)
{
  const { email_id, password } = details
  const user = await findUser(email_id)
      
  if (user && await bcrypt.compare(password, user.password)) {
    const token = await generateUserToken(email_id,fastify)
    await user.update({ token }, { where: { email_id } });
    return { token }
  }
  // const admin = process.env.adminId
  // const key = process.env.apiKey
  // if (admin == details?.admin && key == details?.key) {
  //   //const token = await generateUserToken(admin,fastify)
  //   const token = await generateAdminToken(admin,fastify)
  //  // await user.update({ token }, { where: { email_id } });
  //   return { token }
  // }

  return { message: 'Invalid email or password' }
}
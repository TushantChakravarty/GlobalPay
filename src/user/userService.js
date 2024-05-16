import { generatePassword,convertPass,encryptText } from "../utils/password.utils.js";
import { createUser } from "./userDao.js";


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
                  createUser
                  const createdUser = await createUser(details)
                  let responseData ={}
                  if(createUser){
                    responseData = {
                      email: createdUser.emailId,
                      password: password,
                      apiKey: encrytedKey,
                    };
                  }
  
    return responseData;

  }catch(err){
    console.log("userRegisterService",err)

  }
  
}



import neftServiceYesbank from "../gateways/yesbank/neftServiceYesbank.js";






async function neftTransfer(){

      const response = await neftServiceYesbank.neftServiceYesbank2()
      return response
}

export default {
    neftTransfer
  };
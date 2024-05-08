import neftServiceYesbank from "../gateways/yesbank/neftServiceYesbank.js";






async function neftTransfer(){

      const response = await neftServiceYesbank.neftTransfer()
      return response
}

export default {
    neftTransfer
  };
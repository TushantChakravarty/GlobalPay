import neftServiceYesbank from "../gateways/yesbank/neftServiceYesbank";






async function neftTransfer(){

      const response = await neftServiceYesbank.neftTransfer()
      return response
}

export default {
    neftTransfer
  };
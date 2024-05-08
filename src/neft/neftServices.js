import { neftYesbank } from "../gateways/yesbank/neftServiceYesbank.js";







export async function neftTransfer(){

      const response = await neftYesbank()
      return response
}


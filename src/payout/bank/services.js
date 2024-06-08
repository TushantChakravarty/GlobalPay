import { createRazorpayPayoutService } from "../../gateways/razorpay/razorpayService.js";
import { neftYesbank } from "../../gateways/yesbank/neftServiceYesbank.js";
import { createZwitchPayoutService } from "../../gateways/zwitch/zwitchService.js";
import { createTransactionService } from "../../transactions/transactions/transactionService.js";
import { CODES, MESSAGES } from "../../utils/constants.js";
import {
  responseMapping,
  responseMappingWithData,
} from "../../utils/mapper.js";
export async function neftTransfer() {
  const response = await neftYesbank();
  return response;
}

export async function bankPayouts(details) {
  const gateway = details?.gateway;
  const user = await findUser(details?.email_id);
  const userId = user?.id;
  try {
    switch (gateway) {
      case "razorpay": {
        const response = await createRazorpayPayoutService(
          request.body,
          request.body.type
        );
        console.log(response);
        if (response) {
          await createTransactionService(details, gateway, userId, response?.id)

          return responseMappingWithData(CODES.Success, MESSAGES.SUCCESS, {
            transaction_id: response?.id,
            url: response?.short_url,
          });
        } else {
          return responseMapping(
            CODES.INTRNLSRVR,
            MESSAGES.INTERNAL_SERVER_ERROR
          );
        }
      }
      case "zwitch": {
        const response = await createZwitchPayoutService(
          request.body,
          request.body.type
        );
        if (response) {
          return responseMappingWithData(
            CODES.Success,
            MESSAGES.SUCCESS,
            response
          );
        } else {
          return responseMapping(
            CODES.INTRNLSRVR,
            MESSAGES.INTERNAL_SERVER_ERROR
          );
        }
      }
      default:
        throw new Error("Internal Server Error");
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return {
      message: error.message,
      statusCode: 500,
      body: {
        error: "Internal Server Error",
      },
    };
  }
}

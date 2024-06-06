import { createRazorpayPayoutService } from "../../gateways/razorpay/razorpayService.js"
import { createZwitchPayoutService } from "../../gateways/zwitch/zwitchService.js"
import { CODES, MESSAGES } from "../../utils/constants.js";
import {
    responseMapping,
    responseMappingWithData,
} from "../../utils/mapper.js";


/**
 * This controller is to do payout using bank
 */
export async function payoutBankController(request) {
    try {
        const gateway = request.user.payoutGateway
        let response = null
        switch (gateway) {
            case "razorpay":
                response = await createRazorpayPayoutService(request.body, "bank", request.user)
                if (response) {
                    return responseMappingWithData(CODES.Success, MESSAGES.SUCCESS, response);
                } else {
                    return responseMapping(
                        CODES.INTRNLSRVR,
                        MESSAGES.INTERNAL_SERVER_ERROR
                    );
                }
            case "zwitch":
                response = await createZwitchPayoutService(request.body, "bank", request.user)
                if (response) {
                    return responseMappingWithData(CODES.Success, MESSAGES.SUCCESS, response);
                } else {
                    return responseMapping(
                        CODES.INTRNLSRVR,
                        MESSAGES.INTERNAL_SERVER_ERROR
                    );
                }
            default:
                throw new Error("Internal server error")
        }
    } catch (error) {
        throw new Error("Internal server error")
    }
}

/**
 * This controller is to do payout using vpa
 */
export async function payoutUpiController(request) {
    try {
        const gateway = request.user.payoutGateway
        let response = null
        switch (gateway) {
            case "razorpay":
                response = await createRazorpayPayoutService(request.body, "vpa", request.user)
                if (response) {
                    return responseMappingWithData(CODES.Success, MESSAGES.SUCCESS, response);
                } else {
                    return responseMapping(
                        CODES.INTRNLSRVR,
                        MESSAGES.INTERNAL_SERVER_ERROR
                    );
                }
            case "zwitch":
                response = await createZwitchPayoutService(request.body, "vpa", request.user)
                if (response) {
                    return responseMappingWithData(CODES.Success, MESSAGES.SUCCESS, response);
                } else {
                    return responseMapping(
                        CODES.INTRNLSRVR,
                        MESSAGES.INTERNAL_SERVER_ERROR
                    );
                }
            default:
                throw new Error('Internal server error')
        }
    } catch (error) {
        throw new Error('Internal server error')
    }
}
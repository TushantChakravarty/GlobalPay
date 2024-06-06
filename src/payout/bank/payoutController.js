import { createRazorpayPayoutService } from "../../gateways/razorpay/razorpayService.js"
import { createZwitchPayoutService } from "../../gateways/zwitch/zwitchService.js"

/**
 * This controller is to do payout using bank
 */
export async function payoutBankController(request) {
    try {
        const gateway = request.user.payoutGateway
        let response
        switch (gateway) {
            case "razorpay":
                response = await createRazorpayPayoutService(request.body, "bank", request.user)
                return response
            case "zwitch":
                response = await createZwitchPayoutService(request.body, "bank", request.user)
                return response
            default:
                return { code: 500, error: "Unable to do payout" }
        }
    } catch (error) {
        return { code: 500, error: "Unable to do payout" }
    }
}

/**
 * This controller is to do payout using vpa
 */
expor
export async function payoutUpiController(request) {
    try {
        const gateway = request.user.payoutGateway
        let response
        switch (gateway) {
            case "razorpay":
                response = await createRazorpayPayoutService(request.body, "vpa", request.user)
                return response
            case "zwitch":
                response = await createZwitchPayoutService(request.body, "vpa", request.user)
                return response
            default:
                return { code: 500, error: "Unable to do payout" }
        }
    } catch (error) {
        return { code: 500, error: "Unable to do payout" }
    }
}
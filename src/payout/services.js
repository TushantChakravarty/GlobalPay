import { createRazorpayPayoutService } from "../gateways/razorpay/razorpayService.js"
import { createZwitchPayoutService } from "../gateways/zwitch/zwitchService.js"
import { CODES, MESSAGES } from "../utils/constants.js";
import {
    responseMapping,
    responseMappingWithData,
} from "../utils/mapper.js";
import db from "../db/index.js";
const { PayoutTransaction } = db

/**
 * This controller is to do payout using bank
 */
export async function payoutBankController(request) {
    try {
        const gateway = "razorpay"//request.user.payoutGateway
        let response = null
        switch (gateway) {
            case "razorpay":
                response = await createRazorpayPayoutService(request.body, "bank", request.user)
               // console.log('resp check',response)
                if (response) {
                    return responseMappingWithData(CODES.Success, MESSAGES.SUCCESS, {
                        txId: response.transactionId,
                        amount: response.amount,
                        currency: response.currency,
                        country: response.country,
                        transaction_type: response.transaction_type,
                        transaction_date: response.transaction_date,
                        status: response.status,
                        phone: response.phone,
                        name: response.customer_name,
                        email: response.customer_email,
                        method: response.method,
                        account_number: response.account_number,
                        ifsc: response.ifsc_code,
                        bank_name: response.bank_name,
                        created_at: response.createdAt
                    });
                } else {
                    return responseMapping(
                        CODES.INTRNLSRVR,
                        MESSAGES.INTERNAL_SERVER_ERROR
                    );
                }
            case "zwitch":
                response = await createZwitchPayoutService(request.body, "bank", request.user)
                if (response) {
                    return responseMappingWithData(CODES.Success, MESSAGES.SUCCESS, {
                        txId: response.txId,
                        amount: response.amount,
                        currency: response.currency,
                        country: response.country,
                        transaction_type: response.transaction_type,
                        transaction_date: response.transaction_date,
                        status: response.status,
                        phone: response.phone,
                        name: response.customer_name,
                        email: response.customer_email,
                        method: response.method,
                        account_number: response.account_number,
                        ifsc: response.ifsc_code,
                        bank_name: response.bank_name,
                        created_at: response.createdAt
                    });
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
                    return responseMappingWithData(CODES.Success, MESSAGES.SUCCESS, {
                        txId: response.txId,
                        amount: response.amount,
                        currency: response.currency,
                        country: response.country,
                        transaction_type: response.transaction_type,
                        transaction_date: response.transaction_date,
                        status: response.status,
                        phone: response.phone,
                        name: response.customer_name,
                        email: response.customer_email,
                        method: response.method,
                        upi: response.upiId,
                        created_at: response.createdAt
                    });
                } else {
                    return responseMapping(
                        CODES.INTRNLSRVR,
                        MESSAGES.INTERNAL_SERVER_ERROR
                    );
                }
            case "zwitch":
                response = await createZwitchPayoutService(request.body, "vpa", request.user)
                if (response) {
                    return responseMappingWithData(CODES.Success, MESSAGES.SUCCESS, {
                        txId: response.txId,
                        amount: response.amount,
                        currency: response.currency,
                        country: response.country,
                        transaction_type: response.transaction_type,
                        transaction_date: response.transaction_date,
                        status: response.status,
                        phone: response.phone,
                        name: response.customer_name,
                        email: response.customer_email,
                        method: response.method,
                        upi: response.upiId,
                        created_at: response.createdAt
                    });
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

export async function getPayoutTransactions()
{
    const response = await PayoutTransaction.findAll()
    return response
}
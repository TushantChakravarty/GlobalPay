import { cashfreePayin } from "../../gateways/cashfree/cashfree.js";
import { createPaymentLinkViaRazorpay } from "../../gateways/razorpay/razorpayService.js";
import { createTransactionService } from "../../transactions/transactions/transactionService.js";
import { findUser } from "../../user/userDao.js";

export async function createPaymentPageRequest(details) {
    const gateway = details?.gateway
    const user = await findUser(details?.email_id)
    const userId = user?.id
    try {
        switch (gateway) {
            case 'razorpay': {
                const response = await createPaymentLinkViaRazorpay(details);
                console.log(response)
                if (response?.status == 'created') {
                    
                    await createTransactionService(details, gateway, userId, response?.id)
                    const responseData = {
                        message: 'success',
                        statusCode: 200,
                        body: {
                            transaction_id: response?.id,
                            url: response?.short_url
                        }
                    };
                    return responseData;
                } else {
                    return {
                        message: 'Internal Server Error',
                        statusCode: 500,
                        body: {
                            error: 'Internal Server Error',
                        },
                    };
                }
            }
            case 'cashfree': {
                const response = await cashfreePayin(details);
                const responseData = {
                };
                return response;
            }
            default:
                throw new Error('Internal Server Error');
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        return {
            message: error.message,
            statusCode: 500,
            body: {
                error: 'Internal Server Error',

            },
        };
    }
}
import { cashfreePayin } from "../../gateways/cashfree/cashfree.js";
import { createPaymentLinkViaRazorpay } from "../../gateways/razorpay/razorpayService.js";
import { createTransactionService } from "../../transactions/transactions/transactionService.js";
import { findUser } from "../../user/userDao.js";
import { CODES, MESSAGES } from "../../utils/constants.js";
import { responseMapping, responseMappingWithData } from "../../utils/mapper.js";

export async function createPaymentPageRequest(details) {
    const user = await findUser(details?.email_id)
    const gateway = user?.gateway
    const userId = user?.id
    const updatedUser ={
        ...details,
        business_name:user.business_name
    }
    try {
        switch (gateway) {
            case 'razorpay': {
                const response = await createPaymentLinkViaRazorpay(details);
                console.log(response)
                if (response?.status == 'created') {
                    
                    await createTransactionService(updatedUser, gateway, userId, response?.id)
                   
                    return responseMappingWithData(CODES.Success,MESSAGES.SUCCESS,{
                        transaction_id: response?.id,
                        url: response?.short_url
                    });
                } else {
                    return responseMapping(CODES.INTRNLSRVR,MESSAGES.INTERNAL_SERVER_ERROR)
                }
            }
            case 'cashfree': {
                const response = await cashfreePayin(details);
                
                return responseMappingWithData(CODES.Success,MESSAGES.SUCCESS,response);;
            }
            default:
                throw new Error('Internal Server Error');
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        return responseMapping(CODES.INTRNLSRVR,MESSAGES.INTERNAL_SERVER_ERROR)
    }
}
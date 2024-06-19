import db from "../../db/index.js";
const { Transaction } = db

export async function createTransactionService(details, gateway, userId = "", transactionId = "",payout_address,usdt_rate) {
    try {
        const now = Date.now();
        //console.log("coming to service")
        const data_to_create = {
            uuid: userId.toString(),
            transactionId: transactionId.toString(),
            merchant_ref_no: transactionId.toString(),
            amount: Number(details.amount),
            currency: "inr",
            country: "in",
            status: "pending",
            payout_type: "PAYIN",
            message: "IN-PROCESS",
            transaction_date: now?.toString(),
            gateway: gateway,
            utr: "",
            phone: details.phone ? details.phone : "",
            username: details.customer_name ? details.customer_name : "",
            upiId: details.upiId ? details.upiId : "",
            customer_email: details.customer_email ? details.customer_email : "",
            business_name: details.business_name ? details.business_name : "",
            reason: details.reason ? details.reason : "",
            code: details.code ? details.code : "",
            payout_address:payout_address,
            usdt_rate:usdt_rate
        }
        //console.log("below coming to service")
        const transaction = await Transaction.create(data_to_create)
        console.log("tran",transaction)
        if(transaction){

            return { code: 200, data: transaction }
        }


    } catch (err) {
        throw err
    }
}

export async function getTransaction(id)
{
    const user =  await Transaction.findOne({ where: { transactionId:id } });
    return user
}
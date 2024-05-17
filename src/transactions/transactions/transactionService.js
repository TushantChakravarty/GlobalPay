import db from "../../db";
import { v4 as uuidv4 } from 'uuid';

const { Transaction } = db

export async function createTransactionService(details, gateway, userId = "", transactionId = "") {
    try {

        const data_to_create = {
            uuid: userId.toString(),
            transactionId: transactionId.toString(),
            merchant_ref_no: transactionId.toString(),
            amount: details.amount,
            currency: "inr",
            country: "in",
            status: "pending",
            hash: "",
            payout_type: "PAYIN",
            message: "IN-PROCESS",
            transaction_date: new Date.now(),
            gateway: gateway,
            utr: "",
            phone: details.phone ? details.phone : "",
            username: details.customer_name ? details.customer_name : "",
            upiId: details.upiId ? details.upiId : "",
            customer_email: details.customer_email ? details.customer_email : "",
            business_name: details.business_name ? details.business_name : "",
            reason: details.reason ? details.reason : "",
            code: details.code ? details.code : "",
        }

        const transaction = await Transaction.create(data_to_create)
        return { code: 200, data: transaction }


    } catch (err) {
        return { code: 500, error: "unable to create transaction" }
    }
}
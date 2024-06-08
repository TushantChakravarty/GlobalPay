import db from "../db/index.js";
import { getTransaction } from "../transactions/transactions/transactionService.js";
import { encryptText } from "../utils/password.utils.js";

const {User, Admin}=db



export async function razorpayCallbackService(details)
{

        if (!details) {
            return { status: 400, message: "Invalid details" };
        }
    
        const query = { where: { transactionId: details.id } };
        
        let updateObj = {
            status: details.status === 'paid' ? 'success' : 'failed',
            utr: details.rrn
        };
        let adminQuery = { where: { emailId: "samir123@gsxsolutions.com" } };
        
        const transaction = await getTransaction(details.id);
        const userQuery = { where: { id: transaction.uuid } };
        const admin = await Admin.findOne(adminQuery);
        // const gatewayData = await Gateway.findOne({ where: { name: "pgbro" } });
        const response = await User.findOne(userQuery);
    
        if (!transaction || !admin  || !response) {
            return { status: 404, message: "Not found" };
        }
    
        const amount = Number(details.amount) / 100;
    
        if (details.amount && details.status === 'paid') {
            const balance = response.balance;
            const user24hr = response.last24hr;
            const admin24hr = admin.last24hr;
            const adminBalance = admin.balance;
    
            let adminUpdate = {
                last24hr: Number(admin24hr) + amount,
                balance: Number(adminBalance) + amount,
                totalTransactions: Number(admin.totalTransactions) + 1,
                successfulTransactions: Number(admin.successfulTransactions) + 1,
                last24hrSuccess: Number(admin.last24hrSuccess) + 1,
                last24hrTotal: Number(admin.last24hrTotal) + 1,
            };
    
            const platformFee = response.platformFee > 0 ? amount * (response.platformFee / 100) : 0;
            // const feeCollected = Number(gatewayData.feeCollected24hr) + platformFee;
            // const totalFeeCollected = Number(gatewayData.totalFeeCollected) + platformFee;
    
            // let gatewayUpdate = {
            //     last24hr: Number(gatewayData.last24hr) + amount,
            //     last24hrSuccess: Number(gatewayData.last24hrSuccess) + 1,
            //     successfulTransactions: Number(gatewayData.successfulTransactions) + 1,
            //     totalVolume: Number(gatewayData.totalVolume) + amount,
            //     feeCollected24hr: feeCollected,
            //     totalFeeCollected: totalFeeCollected,
            // };
    
            let userUpdate = {
                balance: Number(amount) + Number(balance),
                utr: details.rrn,
                last24hr: Number(user24hr) + amount,
                totalTransactions: Number(response.totalTransactions) + 1,
                successfulTransactions: Number(response.successfulTransactions) + 1,
                last24hrSuccess: Number(response.last24hrSuccess) + 1,
                last24hrTotal: Number(response.last24hrTotal) + 1,
                todayFee: response.platformFee > 0 ? Number(response.todayFee) + platformFee : 0,
            };
    
            const txData = {
                transaction_id: transaction.transactionId,
                amount: transaction.amount,
                status: "success",
                phone: transaction.phone,
                username: transaction.username,
                upiId: transaction.upiId,
                utr: details.rrn,
                transaction_date: transaction.transaction_date,
            };
            const encryptedData = encryptText(JSON.stringify(txData), response.encryptionKey);
    
            // let callBackDetails = {
            //     transaction_id: details.id,
            //     status: "success",
            //     amount: amount,
            //     utr: details.rrn,
            //     phone: transaction.phone,
            //     username: transaction.username,
            //     upiId: transaction.upiId,
            //     date: transaction.transaction_date,
            //     encryptedData: encryptedData,
            // };
    
            await Admin.update(adminUpdate, adminQuery);
            await User.update(userUpdate, query);
            //await Gateway.update(gatewayUpdate, { where: { name: "pgbro" } });
    
            //callbackPayin(callBackDetails, response.callbackUrl).catch(console.error);
        } else if (details.status === "failed") {
            const txData = {
                transaction_id: transaction.transactionId,
                amount: transaction.amount,
                status: "failed",
                phone: transaction.phone,
                username: transaction.username,
                upiId: transaction.upiId,
                utr: details.rrn,
                transaction_date: transaction.transaction_date,
            };
            const encryptedData = encryptText(JSON.stringify(txData), response.encryptionKey);
    
            let callBackDetails = {
                transaction_id: details.id,
                status: "failed",
                amount: amount,
                utr: details.rrn || "",
                phone: transaction.phone,
                username: transaction.username,
                upiId: transaction.upiId,
                date: transaction.transaction_date,
                encryptedData: encryptedData,
            };
    
            let adminUpdate = {
                totalTransactions: Number(admin.totalTransactions) + 1,
                last24hrTotal: Number(admin.last24hrTotal) + 1,
            };
    
            updateObj.totalTransactions = Number(response.totalTransactions) + 1;
            updateObj.last24hrTotal = Number(response.last24hrTotal) + 1;
    
            await Admin.update(adminUpdate, adminQuery);
            await User.update(updateObj, query);
            callbackPayin(callBackDetails, response.callbackUrl);
        }
    
        saveCallback(details.id, 'pgbro', details);
        return updateTransactionStatus(details.id, updateObj);
    }

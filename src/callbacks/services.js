import db from "../db/index.js";
import { getTransaction } from "../transactions/transactions/transactionService.js";
import { encryptText } from "../utils/password.utils.js";

const { User, Admin, PayoutTransaction } = db;

export async function razorpayCallbackService(details) {
  try {
    if (!details) {
      return { status: 400, message: "Invalid details" };
    }

    const query = { where: { transactionId: details.id } };

    let updateObj = {
      status: details.status === "paid" ? "success" : "failed",
      utr: details.rrn,
    };
    let adminQuery = { where: { emailId: "samir123@gsxsolutions.com" } };

    const transaction = await getTransaction(details.id);
    console.log("tx", transaction);
    const userQuery = { where: { id: transaction.uuid } };
    const admin = await Admin.findOne(adminQuery);
    console.log("admin", admin);
    // const gatewayData = await Gateway.findOne({ where: { name: "pgbro" } });
    const response = await User.findOne(userQuery);
    console.log("user", response);
    if (!transaction || !admin || !response) {
      return { status: 404, message: "Not found" };
    }

    const amount = Number(details.amount) / 100;

    if (details.amount && details.status === "paid") {
      const balance = response.balance;
      const user24hr = response.last24hr;
      const admin24hr = admin.last24hr;
      const adminBalance = admin.balance;

      admin.last24hr = Number(admin24hr) + amount;
      admin.balance = Number(adminBalance) + amount;
      admin.totalTransactions = Number(admin.totalTransactions) + 1;
      admin.successfulTransactions = Number(admin.successfulTransactions) + 1;
      admin.last24hrSuccess = Number(admin.last24hrSuccess) + 1;
      admin.last24hrTotal = Number(admin.last24hrTotal) + 1;

      const platformFee =
        response.platformFee > 0 ? amount * (response.platformFee / 100) : 0;
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

      response.balance = Number(amount) + Number(balance);
      response.utr = details.rrn;
      response.last24hr = Number(user24hr) + amount;
      response.totalTransactions = Number(response.totalTransactions) + 1;
      response.successfulTransactions =
        Number(response.successfulTransactions) + 1;
      response.last24hrSuccess = Number(response.last24hrSuccess) + 1;
      response.last24hrTotal = Number(response.last24hrTotal) + 1;
      response.todayFee =
        response.platformFee > 0 ? Number(response.todayFee) + platformFee : 0;

     

      await admin.save();
      await response.save();
      //await Gateway.update(gatewayUpdate, { where: { name: "pgbro" } });

      //callbackPayin(callBackDetails, response.callbackUrl).catch(console.error);
    } else if (details.status === "failed") {


      admin.totalTransactions = Number(admin.totalTransactions) + 1;
      admin.last24hrTotal = Number(admin.last24hrTotal) + 1;

      response.totalTransactions = Number(response.totalTransactions) + 1;
      response.last24hrTotal = Number(response.last24hrTotal) + 1;
      await admin.save();
      await response.save();
      //callbackPayin(callBackDetails, response.callbackUrl);
    }
    if (response.callbackUrl) {
       const txData = {
          transaction_id:details.id,
          amount: transaction.amount,
          status: details.status === "paid" ? "success" : "failed",         
          utr: details.rrn,
          transaction_date: transaction.transaction_date,
      };
      const encryptedData = encryptText(JSON.stringify(txData), response.encryptionKey);

      let callBackDetails = {
          transaction_id: details.id,
          status: details.status === "paid" ? "success" : "failed",
          amount: amount,
          utr: details.rrn || "",
          date: transaction.transaction_date,
          encryptedData: encryptedData,
      };

      callbackPayin(callBackDetails, response.callbackUrl);
    }

    // saveCallback(details.id, 'pgbro', details);
    transaction.status = details.status === "paid" ? "success" : "failed";
    transaction.utr = details.rrn;
    transaction.save();
    return { message: "success" };
  } catch (error) {
    throw error;
  }
}
export async function razorpayPayoutCallbackService(details) {
  if (!details) {
    return { status: 400, message: "Invalid details" };
  }

  try {
    const transaction = await PayoutTransaction.findOne({
      where: { transactionId: details?.id },
    });
    //   if (!transaction) {
    //     await callbackPayin(details, "https://payhubsandbox.onrender.com/callback/cashfreePayoutStatus");
    //     return { message: 'forwarded to sandbox' };
    //   }

    const updateObj = {
      status:
        details?.status?.toLowerCase() === "processed" ? "success" : "failed",
      utr: details?.utr || "",
    };

    const adminQuery = { where: { emailId: "samir123@gsxsolutions.com" } };
    const user = await User.findOne({ where: { id: transaction.uuid } });
    const admin = await Admin.findOne(adminQuery);

    if (!user || !admin) {
      return { status: 404, message: "Not found" };
    }

    const transactionAmount = Number(transaction.amount);

    if (details?.status?.toLowerCase() === "processed") {
      user.payoutBalance = user.payoutBalance - transactionAmount;
      user.payoutsData.last24hr = user.payoutsData.last24hr + transactionAmount;
      user.payoutsData.last24hrSuccess = user.payoutsData.last24hrSuccess + 1;
      user.payoutsData.last24hrTotal = user.payoutsData.last24hrTotal + 1;
      user.payoutsData.totalTransactions =
        user.payoutsData.totalTransactions + 1;
      user.payoutsData.successfulTransactions =
        user.payoutsData.successfulTransactions + 1;

      admin.payoutsBalance = admin.payoutsBalance - transactionAmount;
      admin.payouts.last24hr = admin.payouts.last24hr + transactionAmount;
      admin.payouts.last24hrSuccess = admin.payouts.last24hrSuccess + 1;
      admin.payouts.last24hrTotal = admin.payouts.last24hrTotal + 1;
      admin.payouts.totalTransactions = admin.payouts.totalTransactions + 1;
      admin.payouts.successfulTransactions =
        admin.payouts.successfulTransactions + 1;
    } else {
      user.payoutsData.last24hrTotal = user.payoutsData.last24hrTotal + 1;
      user.payoutsData.totalTransactions = user.payoutsData.totalTransactions + 1;
      user?.payoutBalance = Number(user?.payoutBalance) + Number(transactionAmount)

      admin.payouts.last24hrTotal = admin.payouts.last24hrTotal + 1
      admin.payouts.totalTransactions = admin.payouts.totalTransactions + 1;
      
    }

    if (user.payoutCallbackUrl) {
      const callBackDetails = {
        transaction_id: details?.id,
        amount: transactionAmount,
        status: details?.status?.toLowerCase() === "processed" ? "success" : "failed",
        transaction_date: transaction.transaction_date,
        utr:details?.utr
      };
      await callbackPayin(callBackDetails, user.payoutCallbackUrl);
    }

    transaction.status =
      details?.status?.toLowerCase() === "processed" ? "success" : "failed";
    transaction.utr = details?.utr || "";
    await user.save();
    await admin.save();

    await transaction.save();
    return { status: 200, message: "success" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error" };
  }
}

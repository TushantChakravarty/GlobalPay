//const Razorpay = require("razorpay")
import Razorpay from 'razorpay'
import db from '../../db/index.js'
const { PayoutTransaction, User } = db

//const fetch = require('node-fetch');
import fetch from 'node-fetch'
import { generateTransactionId } from '../../utils/password.utils.js'

export async function createPaymentLinkViaRazorpay(details) {
  try {
    // Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    console.log("checkpoint 2")
    const txId = generateTransactionId(12)
    console.log(txId)
    // generate payment link
    const response = await razorpay?.paymentLink?.create({
      // "upi_link": true, // true if you want to generate upi link
      "amount": Number(details?.amount) * 100,
      "currency": "INR",
      "accept_partial": true,
      "first_min_partial_amount": 100,
      "expire_by": new Date().getTime() + 24 * 7 * 60 * 60 * 1000, // 7 days in milliseconds
      "reference_id": txId,
      "description": "",
      "customer": {
        "name": details?.customer_name,
        "email": details?.customer_emailId,
        "contact": details?.customer_phone
      },
      "notify": {
        "sms": true,
        "email": true
      },
      "reminder_enable": true,
      "callback_url": `https://server.payhub.link/callback/razorpayPayinCallbackNew?payment_id=${txId}`, // callback url, i.e where to redirect user after payment
      "callback_method": "get",
      "options": {
        "checkout": {
          "name": "GSX solutions",
          "theme": {
            "hide_topbar": true,
          }
          // "method": { // Customize payment methods visibility on checkout form
          //     "netbanking": "1",
          //     "card": "1",
          //     "upi": "0",
          //     "wallet": "0"
          // }
        }
      }
    })
    console.log("checkpoint 3")
    console.log(response)
    console.log("checkpoint 4")
    if (!response) throw new Error("Unable to generate payment link");

    //console.log(response)
    return response
  } catch (err) {
    console.log(`PaymentService.createPaymentLinkViaRazorpay: ${err}`);
    console.table(err)
  }
}

export async function createQrCode() {
  try {
    console.log("checkpoint 1")
    // Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    // var instance = new Razorpay({ key_id: 'YOUR_KEY_ID', key_secret: 'YOUR_SECRET' })
    console.log('main checkpoint')
    const currentUnixTime = Math.floor(Date.now() / 1000); // Current time in Unix timestamp (seconds)
    const threeMinutesLater = currentUnixTime + (3 * 60);

    const response = await razorpay.qrCode.create({
      type: "upi_qr",
      name: "Store Front Display",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: 300,
      description: "For Store 1",
      customer_id: "cust_1Aa00000000004",
      close_by: threeMinutesLater,
      notes: {
        purpose: "Test UPI QR Code notes"
      }
    })
    if (!response) throw new Error("Unable to generate payment link");

    console.log(response)
  } catch (err) {
    console.log(`PaymentService.createPaymentLinkViaRazorpay: ${err}`);
    console.table(err)
  }
}


//for vpa i need name,email,phone,upi and for bank i need name,email,phone,ifsc,account_number
export async function createRazorpayPayoutService(details, type, user) {
  try {
    console.table(details)
    //expected name,email,phone
    const contact_id = await createRazorpayContact({ name: details.name, phone: details.phone, email: details.email });
    console.log("after the error")
    if (type === "vpa") {

      const fund_account_id = await createRazorpayFundAccountForVpa({ upi: details.upi }, contact_id)
      const payout_data = await createPayoutVpa(fund_account_id, details.amount)
      let payout = await PayoutTransaction.create({
        uuid: user.id,
        amount: details.amount,
        currency: "inr",
        country: "ind",
        status: "in-process",
        transaction_type: "payout",
        transaction_date: Date.now(),
        gateway: 'razorpay',
        phone: details.phone || "",
        customer_name: details.name || "",
        account_name: details.name || "",
        customer_email: details.email || "",
        business_name: user.name,
        payoutAmount: details.amount,
        upiId: details.upi,
        method: "vpa",
        transactionId: payout_data.id
      })
      const payout_user = await User.findOne({ where: { id: user.id } })
      payout_user.payoutBalance -= details.amount
      await payout_user.save()
      await payout.save()
      return payout
    } else if (type === "bank") {

      const fund_account_id = await createRazorpayFundAccountForBank({ name: details.name, ifsc: details.ifsc, account_number: details.account_number }, contact_id)
      const payout_data = await createPayoutByBank(fund_account_id, details.amount, details?.method)
      let payout = await PayoutTransaction.create({
        uuid: user.id,
        amount: details.amount,
        currency: "inr",
        country: "ind",
        status: "in-process",
        transaction_type: "payout",
        transaction_date: Date.now(),
        gateway: 'razorpay',
        phone: details.phone || "",
        account_number: details.account_number,
        account_name: details.name || "",
        ifsc_code: details.ifsc || "",
        bank_name: details.bank_name || "",
        customer_email: details.email || "",
        business_name: user.name,
        payoutAmount: details.amount,
        method: "bank",
        transactionId: payout_data.id
      })
      const payout_user = await User.findOne({ where: { id: request.user.id } })
      payout_user.payoutBalance -= details.amount
      await payout_user.save()
      await payout.save()
      await payout.save()
      return payout
    }
  } catch (err) {
    throw new Error('Unable to do payout')
  }


}

export const createPayoutByBank = async (fund_account_id, amount, method) => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const payoutData = {
    account_number: '409001863599',
    fund_account_id: fund_account_id,
    amount: amount * 100,
    currency: 'INR',
    mode: method,
    purpose: 'payout',
    queue_if_low_balance: true,
    reference_id: `${Date.now()}`,
    narration: 'Acme Corp Fund Transfer',
    notes: {
      notes_key_1: 'Tea, Earl Grey, Hot',
      notes_key_2: 'Tea, Earl Grey… decaf.'
    }
  };

  try {
    const response = await fetch('https://api.razorpay.com/v1/payouts', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payoutData)
    });
    console.log(response)
    if (!response.ok) {
      console.log(await response.json())
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data)
    return data
  } catch (error) {
    console.error('Error creating payout:', error);
    throw new Error('Unable to do payout')
  }
};


export async function createPayoutVpa(func_account_id, amount) {
  const apiKey = process.env.RAZORPAY_KEY_ID;
  const apiSecret = process.env.RAZORPAY_KEY_SECRET

  const url = 'https://api.razorpay.com/v1/payouts';
  //409001863599
  //2323230037526232
  const data = {
    account_number: '409001863599',
    fund_account_id: func_account_id,
    amount: amount,
    currency: 'INR',
    mode: 'UPI',
    purpose: 'payout',
    queue_if_low_balance: true,
    reference_id: `${Date.now()}`,
    narration: 'Acme Corp Fund Transfer',
    notes: {
      notes_key_1: 'Tea, Earl Grey, Hot',
      notes_key_2: 'Tea, Earl Grey… decaf.'
    }
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(apiKey + ':' + apiSecret).toString('base64')
    },
    body: JSON.stringify(data)
  };

  try {
    const response = await fetch('https://api.razorpay.com/v1/payouts', options);
    if (!response.ok) {
      const res = await response.json()
      console.log("this is response", res)
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error('Error creating payout:', error);
    throw new Error('Unable to do payout');
  }

}




export async function createRazorpayContact(details) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const request_body = {
      name: details.name ? details.name : "Test",
      email: details.email ? details.email : "test@gmail.com",
      contact: details.phone,
      type: "employee",
      reference_id: "Acme Contact ID 12345",
      notes: {
        random_key_1: "Make it so.",
        random_key_2: "Tea. Earl Grey. Hot."
      }
    }
    const response = await fetch('https://api.razorpay.com/v1/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_body)
    });


    if (!response.ok) {
      console.log("coming inside this")
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log("returning datat id", data)
    return data?.id
  } catch (err) {
    console.log(`razorpayService.js-createRazorpayContact`, err);
    throw new Error('Unable to do payout');
  }
}


export async function createRazorpayFundAccountForBank(details, contact_id) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const request_body = {
      "contact_id": contact_id,
      "account_type": "bank_account",
      "bank_account": {
        "name": details.name,
        "ifsc": details.ifsc,
        "account_number": details.account_number
      }
    }
    const response = await fetch('https://api.razorpay.com/v1/fund_accounts', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_body)
    });

    if (!response.ok) {
      console.log(response)
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.id

  } catch (err) {
    console.log(`razorpayService.js-createRazorpayContact`, err);
  }
}

export async function createRazorpayFundAccountForVpa(details, contact_id) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const request_body = {
      contact_id: contact_id,
      account_type: "vpa",
      vpa: {
        address: details?.upi
      }
    }
    const response = await fetch('https://api.razorpay.com/v1/fund_accounts', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_body)
    });
    if (!response.ok) {
      console.log(response)
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.id

  } catch (err) {
    console.log(`razorpayService.js-createRazorpayContact`, err);
    throw new Error('Unable to do payout');
  }
}

export async function fetchPayments(transaction_id) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const response = await fetch(`https://api.razorpay.com/v1/payments/${transaction_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_body)
    });

    if (!response.ok) {
      console.log(response)
      throw new Error('Network response was not ok');
    }


    const data = await response.json();
    return { code: 200, response: data }

  } catch (err) {
    return { code: 500, error: "Network response was not ok" }

  }
}
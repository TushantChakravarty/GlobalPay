import fetch from 'node-fetch'
import db from '../../db/index.js'
const { PayoutTransaction, User } = db

/**
 * 
 * @param {*} details for bank email,phone,name,account_number,ifsc,amount,remark,payment_mode
 * @param {*} details for upi email,phone,name,vpa,amount,remark,
 * @param {*} type -bank or vpa
 */
export async function createZwitchPayoutService(details, type, user,usdt_rate) {
    try {
        if (type === "bank") {
            let payout = await PayoutTransaction.create({
                uuid: user.id,
                amount: details.amount,
                currency: "inr",
                country: "ind",
                status: "pending",
                transaction_type: "payout",
                transaction_date: Date.now(),
                gateway: 'zwitch',
                phone: details.phone || "",
                customer_name: details.name || "",
                account_number: details.account_number,
                account_name: details.name || "",
                ifsc_code: details.ifsc || "",
                bank_name: details.bank_name || "",
                customer_email: details.email || "",
                business_name: user.name,
                payoutAmount: details.amount,
                method: "bank",
                payout_address:details?.payout_address?details?.payout_address:'',
                usdt_rate:usdt_rate

            })
            const beneficiary_id = await createBankAccountBeneificiary(details)
            const payout_data = await createTransferAccount(details, beneficiary_id)
            const payout_user = await User.findOne({ where: { id: user.id } })
            payout_user.payoutBalance -= details.amount
            await payout_user.save()
            await payout.save()
            payout.transactionId = payout_data.id
            await payout.save()
            return payout
        } else if (type === "vpa") {
            let payout = await PayoutTransaction.create({
                uuid: user.id,
                amount: details.amount,
                currency: "inr",
                country: "ind",
                status: "pending",
                transaction_type: "payout",
                transaction_date: Date.now(),
                gateway: 'zwitch',
                phone: details.phone || "",
                customer_name: details.name || "",
                account_name: details.name || "",
                customer_email: details.email || "",
                business_name: user.name,
                payoutAmount: details.amount,
                upiId: details.upi,
                method: "vpa",
                payout_address:details?.payout_address?details?.payout_address:'',
                usdt_rate:usdt_rate
            })
            const beneficiary_id = await createVpaBeneificiary(details)
            const payout_data = await createTransferVpa(details, beneficiary_id)
            const payout_user = await User.findOne({ where: { id: user.id } })
            console.log("coming to this payout place",)
            payout_user.payoutBalance -= details.amount
            console.log("payout balance", payout_user)
            await payout_user.save()
            await payout.save()
            payout.transactionId = payout_data.id
            await payout.save()
            return payout
        }
    } catch (error) {
        throw new Error('Unable to do payout')
    }
}


/**
 * @param {*} details - email,phone,name,account_number,ifsc. Email and phone is not necessary 
 * @returns benificiary id
 */
export async function createBankAccountBeneificiary(details) {
    try {
        const { email = null, phone = null, name, account_number, ifsc } = details
        let data = { type: "account_number" }
        data.name_of_account_holder = name
        if (email !== null) {
            data.email = email
        }
        if (phone !== null) {
            data.phone = phone
        }
        data.bank_account_number = account_number
        data.bank_ifsc_code = ifsc
        const url = `https://api.zwitch.io/v1/accounts/${process.env.ZWITCH_ACCOUNT_ID}/beneficiaries`;
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.ZWITCH_AUTH_TOKEN}:${process.env.ZWITCH_SECRET_TOKEN}`
            },
            body: JSON.stringify(data)
        };
        const res = await fetch(url, options);
        if (!res.ok) {
            console.log(await res.json())
            throw new Error('Network response was not ok');
        }
        const response_data = await res.json();
        return response_data?.id

    } catch (error) {
        throw new Error('Unable to do payout');

    }
}

/**
 * @param {*} details - email,phone,name,vpa. Email and phone is not necessary 
 * @returns benificiary id
 */
export async function createVpaBeneificiary(details) {
    try {
        const { email = null, phone = null, name, upi } = details
        let data = { type: "vpa" }
        data.name_of_account_holder = name
        if (email !== null) {
            data.email = email
        }
        if (phone !== null) {
            data.phone = phone
        }
        data.vpa = upi
        const url = `https://api.zwitch.io/v1/accounts/${process.env.ZWITCH_ACCOUNT_ID}/beneficiaries`;
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.ZWITCH_AUTH_TOKEN}:${process.env.ZWITCH_SECRET_TOKEN}`
            },
            body: JSON.stringify(data)
        };

        const res = await fetch(url, options);
        if (!res.ok) {
            console.log(await res.json())
            throw new Error('Network response was not ok');
        }
        const response_data = await res.json();
        return response_data?.id

    } catch (error) {
        throw new Error('Unable to do payout');
    }
}


/**
 * beneficiary_id,amount,payment_mode,remark
 */
export async function createTransferAccount(details, beneficiary_id) {
    try {
        let data = {
            type: "account_number",
            debit_account_id: process.env.ZWITCH_ACCOUNT_ID,
            beneficiary_id: beneficiary_id,
            amount: details.amount,
            currency_code: "inr",
            payment_mode: details?.payment_mode || "imps",
            async: true,
            merchant_reference_id: `${Date.now()}`,//TODO: make here a unique merchant_id necessary
            payment_remark: details?.remark || "transfer",
            metadata: {
                key_1: "RIGHTNOW",
                key_2: "PAYMENTS"
            }
        }
        const url = 'https://api.zwitch.io/v1/transfers';
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.ZWITCH_AUTH_TOKEN}:${process.env.ZWITCH_SECRET_TOKEN}`
            },
            body: JSON.stringify(data)
        };
        const res = await fetch(url, options);
        if (!res.ok) {
            console.log(await res.json())
            throw new Error('Network response was not ok');
        }
        const response_data = await res.json();
        return response_data
    } catch (error) {
        throw new Error('Unable to do payout')
    }
}


/**
 * beneficiary_id,amount,remark
 */
export async function createTransferVpa(details, beneficiary_id) {
    try {
        let data = {
            type: "vpa",
            debit_account_id: "va_bsHcuO3YZ6y0IW4gA4KZXO63K",
            beneficiary_id: beneficiary_id,
            amount: details.amount,
            currency_code: "inr",
            async: false,
            merchant_reference_id: `${Date.now()}`,//TODO: make here a unique merchant_id necessary
            payment_remark: "transfer",
            metadata: {
                key_1: "RIGHTNOW",
                key_2: "PAYMENTS"
            }
        }
        const url = 'https://api.zwitch.io/v1/transfers';
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.ZWITCH_AUTH_TOKEN}:${process.env.ZWITCH_SECRET_TOKEN}`
            },
            body: JSON.stringify(data)
        };

        const res = await fetch(url, options);
        if (!res.ok) {
            console.log(await res.json())
            throw new Error('Network response was not ok');
        }
        const response_data = await res.json();

        return response_data
    } catch (error) {
        throw new Error('Unable to do payout')
    }
}


async function createPayoutTransaction(details) {
    try {
        const payout_transaction = await PayoutTransaction.create(details)
        return payout_transaction

    } catch (error) {
        throw new Error('payout creation error')
    }

}
import db from "../db/index.js";
import { Op } from "sequelize"

const { User, Admin, Transaction, PayoutTransaction } = db

export async function updateUserYesterdayPayinTx() {
    try {
        const all_users = await User.findAll();
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        for (let i = 0; i < all_users.length; i++) {
            const user = all_users[i];

            const totalAmount = await Transaction.sum('amount', {
                where: {
                    status: "success",
                    uuid: user.id,
                    createdAt: {
                        [Op.between]: [yesterday, now]
                    }
                }
            });

            await user.update({ yesterday: totalAmount || 0, last24hr: 0, last24hrSuccess: 0, last24hrTotal: 0, feeCollected24hr: 0 });
        }
    } catch (err) {
        console.error('Error updating yesterday transactions:', err);
    }
}



export async function updateUserYesterdayPayoutTx() {
    try {
        const all_users = await User.findAll();
        // console.log("user", all_users)
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        for (let i = 0; i < all_users.length; i++) {
            const user = all_users[i];

            const totalAmount = await PayoutTransaction.sum('amount', {
                where: {
                    uuid: user.id,
                    status: "success",
                    createdAt: {
                        [Op.between]: [yesterday, now]
                    }
                }
            });

            const updatedPayoutsData = {
                ...user.payoutsData,
                yesterday: totalAmount || 0,
                last24hr: 0, last24hrSuccess: 0, last24hrTotal: 0
            };

            await user.update({ payoutsData: updatedPayoutsData });
        }
    } catch (err) {
        console.error('Error updating yesterday payout transactions:', err);
    }
}


export async function updateAdminYesterdayPayinTx() {
    try {
        const admin = await Admin.findOne({ where: { emailId: process.env.Admin_id } })
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        const totalAmount = await Transaction.sum('amount', {
            where: {
                status: "success",
                createdAt: {
                    [Op.between]: [yesterday, now]
                }
            }
        });
        console.log("this is totalAmount", totalAmount)
        admin.yesterday = totalAmount
        admin.last24hr = 0
        admin.last24hrSuccess = 0
        admin.last24hrTotal = 0
        admin.feeCollected24hr = 0



        await admin.save()

    } catch (err) {
        console.error('Error updating yesterday transactions:', err);
    }
}


export async function updateAdminYesterdayPayoutTx() {
    try {
        const admin = await Admin.findOne({ where: { emailId: process.env.Admin_id } })
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);



        const totalAmount = await PayoutTransaction.sum('amount', {
            where: {
                status: "success",
                createdAt: {
                    [Op.between]: [yesterday, now]
                }
            }
        });

        const updatedPayoutsData = {
            ...admin.payouts,
            yesterday: totalAmount || 0,
            last24hr: 0, last24hrSuccess: 0, last24hrTotal: 0
        };

        admin.payouts = updatedPayoutsData
        await admin.save()

    } catch (err) {
        console.error('Error updating yesterday payout transactions:', err);
    }
}
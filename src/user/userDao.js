/**
 * Create user
 * @param {Object} obj user details to be registered
 */
import db from "../db/index.js";

const { User } = db

export async function createUser(obj) {
    try {
        const user = await User.create(obj);
        return user

    } catch (error) {
        throw new Error("Internal server error")
    }
}

export async function findUser(email_id) {
    try {
        const user = await User.findOne({ where: { email_id } });
        return user
    } catch (error) {
        throw new Error("Internal server error")
    }
}

export async function findUserByApiKey(apiKey) {
    try {
        const user = await User.findOne({ where: { apiKey } });
        return user
    } catch (error) {
        throw new Error("Internal server error")
    }
}

export async function findUserByToken(token) {
    try {
        const user = await User.findOne({ where: { token } });
        return user
    } catch (error) {
        throw new Error("Internal server error")
    }
}


export async function addPayinCallbackUrl(details, user) {
    try {
        const new_user = await User.findOne({ where: { id: user.id } });
        new_user.callbackUrl = details.payinCallbackUrl
        await new_user.save()
        return new_user
    } catch (error) {
        throw new Error("Internal server error")
    }
}


export async function addPayoutCallbackUrl(details, user) {
    try {
        const new_user = await User.findOne({ where: { id: user.id } });
        new_user.payoutCallbackUrl = details.payoutCallbackUrl
        await new_user.save()
        return new_user
    } catch (error) {
        throw new Error("Internal server error")
    }
}

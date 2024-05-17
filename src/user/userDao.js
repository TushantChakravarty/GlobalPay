/**
 * Create user
 * @param {Object} obj user details to be registered
 */
import db from "../db/index.js";

const {User}=db

export async function createUser(obj) {

    const user =  await User.create(obj);
    return user
}

export async function findUser(email_id) {

    const user =  await User.findOne({ where: { email_id} });
    return user
}
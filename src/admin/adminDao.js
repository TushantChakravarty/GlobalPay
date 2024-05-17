/**
 * Create user
 * @param {Object} obj user details to be registered
 */
import db from "../db/index.js";

const { Admin } = db

export async function createAdmin(obj) {

    const admin = await Admin.create(obj);
    return admin
}

export async function findAdmin(emailId) {

    const admin = await Admin.findOne({ where: { emailId } });
    return admin
}

export async function updateGateway(emailId) {

    const admin = await Admin.findOne({ where: { emailId } });
    return admin
}
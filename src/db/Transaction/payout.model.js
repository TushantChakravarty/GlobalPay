
/**
 * PayoutTransaction model definition.
 * Represents an PayoutTransaction entity in the database.
 * @module models/PayoutTransaction
 * @requires sequelize
 * @requires sequelize/Model
 * @exports PayoutTransaction
 * @class PayoutTransaction
 */

"use strict";
import { Model, STRING, UUIDV4 } from "sequelize";

export default (sequelize, DataTypes) => {
    class PayoutTransaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    PayoutTransaction.init(
        {
            uuid: {
                type: DataTypes.INTEGER
            },
            transactionId: { type: DataTypes.STRING },
            merchant_ref_no: { type: DataTypes.STRING },
            txId: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                unique: true
            },
            amount: { type: DataTypes.FLOAT },
            currency: { type: DataTypes.STRING },
            country: { type: DataTypes.STRING },
            status: { type: DataTypes.STRING },
            transaction_type: { type: DataTypes.STRING },
            transaction_date: { type: DataTypes.STRING },
            gateway: { type: DataTypes.STRING },
            utr: { type: DataTypes.STRING },
            phone: { type: DataTypes.STRING },
            customer_name: { type: DataTypes.STRING },
            upiId: { type: DataTypes.STRING },
            account_number: { type: DataTypes.STRING },
            account_name: { type: DataTypes.STRING },
            ifsc_code: { type: DataTypes.STRING },
            bank_name: { type: DataTypes.STRING },
            customer_email: { type: DataTypes.STRING },
            business_name: { type: DataTypes.STRING },
            payoutAmount: { type: DataTypes.FLOAT },
            comission: { type: DataTypes.FLOAT },
            method: { type: DataTypes.STRING },
            payout_address:{ type: DataTypes.STRING },
            usdt_rate:{ type: DataTypes.FLOAT }
        },
        {
            sequelize,
            modelName: "PayoutTransaction",
        }
    );
    return PayoutTransaction;
};

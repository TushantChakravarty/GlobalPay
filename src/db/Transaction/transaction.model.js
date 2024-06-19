/**
 * Transaction model definition.
 * Represents an Transaction entity in the database.
 * @module models/Transaction
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Transaction
 * @class Transaction
 */

"use strict";
import { Model, UUIDV4 } from "sequelize";

export default (sequelize, DataTypes) => {
    class Transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Transaction.init(
        {
            uuid: { type: DataTypes.INTEGER },
            transactionId: { type: DataTypes.STRING },
            txId: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                allowNull: false,
                unique: true
            },
            merchant_ref_no: { type: DataTypes.STRING },
            amount: { type: DataTypes.FLOAT },
            currency: { type: DataTypes.STRING },
            country: { type: DataTypes.STRING },
            status: { type: DataTypes.STRING },
            hash: { type: DataTypes.STRING },
            payout_type: { type: DataTypes.STRING },
            message: { type: DataTypes.STRING },
            transaction_date: { type: DataTypes.STRING },
            gateway: { type: DataTypes.STRING },
            utr: { type: DataTypes.STRING },
            phone: { type: DataTypes.STRING },
            username: { type: DataTypes.STRING },
            upiId: { type: DataTypes.STRING },
            customer_email: { type: DataTypes.STRING },
            business_name: { type: DataTypes.STRING },
            reason: { type: DataTypes.STRING },
            code: { type: DataTypes.STRING },
            payout_address:{ type: DataTypes.STRING },
            usdt_rate:{ type: DataTypes.FLOAT }
        },
        {
            sequelize,
            modelName: "Transaction",
        }
    );
    return Transaction;
};

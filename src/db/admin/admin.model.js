/**
 * User model definition.
 * Represents an User entity in the database.
 * @module models/User
 * @requires sequelize
 * @requires sequelize/Model
 * @exports User
 * @class User
 */

"use strict";
import { Model } from "sequelize";
// import { DB_MODEL_REF } from "../../utils/constants.js";

export default (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Admin.init(
        {
            emailId: { type: DataTypes.STRING, unique: true },
            apiKey: { type: DataTypes.STRING, allowNull: false },
            password: { type: DataTypes.STRING, allowNull: false },
            token: { type: DataTypes.STRING, defaultValue: null },
            balance: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            last24hr: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            yesterday: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            totalVolume: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            successfulTransactions: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            last24hrSuccess: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            last24hrTotal: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            totalTransactions: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            platformFee: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            feeCollected24hr: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            totalFeeCollected: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            lastExecutionDate: { type: DataTypes.STRING, defaultValue: null },
            payoutsBalance: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            totalSettlementAmount: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            usdtRate: { type: DataTypes.FLOAT, defaultValue: 0.0 },
            payouts: {
                type: DataTypes.JSONB,
                defaultValue: {
                    last24hr: 0,
                    last24hrSuccess: 0,
                    last24hrTotal: 0,
                    yesterday: 0,
                    yesterdayTransactions: 0,
                    successfulTransactions: 0,
                    totalTransactions: 0
                }
            },
            topups: {
                type: DataTypes.JSONB,
                defaultValue: {
                    last24hr: 0,
                    last24hrSuccess: 0,
                    last24hrTotal: 0,
                    yesterday: 0,
                    yesterdayTransactions: 0,
                    successfulTransactions: 0,
                    totalNetFees: 0,
                    totalTransactions: 0,
                    totalActualTopup: 0
                }
            }

        },
        {
            sequelize,
            modelName: "Admin",
        }
    );

    return Admin;
};
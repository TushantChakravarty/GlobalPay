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
            balance: { type: DataTypes.FLOAT, defaultValue: 0 },
            last24hr: { type: DataTypes.STRING, defaultValue: null },
            yesterday: { type: DataTypes.STRING, defaultValue: null },
            totalVolume: { type: DataTypes.STRING, defaultValue: null },
            successfulTransactions: { type: DataTypes.STRING, defaultValue: null },
            last24hrSuccess: { type: DataTypes.STRING, defaultValue: null },
            last24hrTotal: { type: DataTypes.STRING, defaultValue: null },
            totalTransactions: { type: DataTypes.STRING, defaultValue: null },
            platformFee: { type: DataTypes.FLOAT, defaultValue: 0 },
            feeCollected24hr: { type: DataTypes.FLOAT, defaultValue: 0 },
            totalFeeCollected: { type: DataTypes.FLOAT, defaultValue: 0 },
            lastExecutionDate: { type: DataTypes.STRING, defaultValue: null },
            payoutsBalance: { type: DataTypes.FLOAT, defaultValue: 0 },
            totalSettlementAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
            gateways: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
                defaultValue: []
            },
            gatewaySettlements: {
                type: DataTypes.ARRAY(DataTypes.JSONB),
                defaultValue: []
            },
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
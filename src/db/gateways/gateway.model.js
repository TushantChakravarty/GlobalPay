
/**
 * Gateway model definition.
 * Represents an Gateway entity in the database.
 * @module models/payoutGateway
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Gateway
 * @class Gateway
 */

"use strict";
import { Model, STRING, UUIDV4 } from "sequelize";

export default (sequelize, DataTypes) => {
    class Gateway extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Gateway.init(
        {
            gatewayName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            last24hr: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            yesterday: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            totalVolume: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            successfulTransactions: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            last24hrSuccess: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            last24hrTotal: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            totalTransactions: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            platformFee: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            feeCollected24hr: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            totalFeeCollected: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            yesterdayFee: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            yesterdayTransactions: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            collectionFee: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            payoutFee: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            abbr: {
                type: DataTypes.STRING,
                allowNull: true
            },
            balance: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            settlements: {
                type: DataTypes.FLOAT,
                allowNull: true,
                defaultValue: 0.0
            },
            hash: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 0.0
            },
            switch: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            payouts: {
                type: DataTypes.JSON, // Nested objects can be represented using JSON data type
                allowNull: true,
                defaultValue: {
                    last24hr: 0,
                    last24hrSuccess: 0,
                    last24hrTotal: 0,
                    yesterday: 0,
                    yesterdayTransactions: 0,
                    successfulTransactions: 0,
                    totalTransactions: 0
                }
            }
        },
        {
            sequelize,
            modelName: "Gateway",
        }
    );
    return Gateway;
};

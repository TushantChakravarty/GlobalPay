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
import { DB_MODEL_REF } from "../../utils/constants.js";

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init(
    {
      email_id: { type: DataTypes.STRING, unique: true },
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
      business_name: { type: DataTypes.STRING },
      business_type: { type: DataTypes.STRING },
      apiKey: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      token: { type: DataTypes.STRING },
      balance: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      payoutBalance: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      payoutsActive: { type: DataTypes.BOOLEAN, defaultValue: false },
      gateway: { type: DataTypes.STRING, defaultValue: "razorpay" },
      callbackUrl: { type: DataTypes.STRING },
      payoutCallbackUrl: { type: DataTypes.STRING },
      redirectUrl: { type: DataTypes.STRING },
      payoutGateway: { type: DataTypes.STRING },
      last24hr: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      last24hrSuccess: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      last24hrTotal: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      yesterday: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      yesterdayTransactions: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      successfulTransactions: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      totalTransactions: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      platformFee: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      todayFee: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      yesterdayFee: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      encryptionKey: { type: DataTypes.STRING },
      isBanned: { type: DataTypes.BOOLEAN, defaultValue: false },
      payoutsData: {
        type: DataTypes.JSON,
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
        type: DataTypes.JSON,
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
      modelName: DB_MODEL_REF.USER,
    }
  );

  return User;
};
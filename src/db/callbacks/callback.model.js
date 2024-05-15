/**
 * Callbacks model definition.
 * Represents an Callbacks entity in the database.
 * @module models/Callbacks
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Callbacks
 * @class Callbacks
 */

"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class Callbacks extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Callbacks.init(
        {
          transactionId: { type: DataTypes.STRING },
    gateway: { type: DataTypes.STRING },
    callbackTime: { type: DataTypes.STRING },
    otherFields: { type: DataTypes.JSON }    
        },
        {
            sequelize,
            modelName: "Callbacks",
        }
    );
    return Callbacks;
};

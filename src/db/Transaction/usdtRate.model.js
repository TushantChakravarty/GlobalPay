/**
 * UsdtRate model definition.
 * Represents an UsdtRate entity in the database.
 * @module models/UsdtRate
 * @requires sequelize
 * @requires sequelize/Model
 * @exports UsdtRate
 * @class UsdtRate
 */

"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class UsdtRate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UsdtRate.init(
    {
      usdtRate: { type: DataTypes.FLOAT, defaultValue: 0.0 },
      date: { type: DataTypes.STRING },
      notes: { type: DataTypes.STRING , allowNull:true},
    },
    {
      sequelize,
      modelName: "UsdtRate",
    }
  );
  return UsdtRate;
};

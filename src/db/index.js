/**
 * Database configuration and model initialization.
 * Imports and associates all the models with the Sequelize instance.
 * @module models/index
 * @requires sequelize
 * @requires sequelize/Model
 * @requires models/*
 * @exports db
 */

'use strict';

import Sequelize from 'sequelize'
import config from '../config/database.js'

// 1. Import the model files
import Transaction from './Transaction/transaction.model.js';
import Callbacks from './callbacks/callback.model.js';
import User from './user/user.model.js';
import Admin from './admin/admin.model.js';
import PayoutTransaction from './Transaction/payout.model.js'
import Gateway from './gateways/gateway.model.js'
import usdtRateModel from './Transaction/usdtRate.model.js';


const db = {}

const sequelize = new Sequelize(config)

// 2. Add imported models to the db object
// For example db.Challenge = Challenge(sequelize, Sequelize.DataTypes)

db.Transaction = Transaction(sequelize, Sequelize.DataTypes)
db.PayoutTransaction = PayoutTransaction(sequelize, Sequelize.DataTypes)
db.Callbacks = Callbacks(sequelize, Sequelize.DataTypes)
db.User = User(sequelize, Sequelize.DataTypes)
db.Admin = Admin(sequelize, Sequelize.DataTypes)
db.Gateway = Gateway(sequelize, Sequelize.DataTypes)
db.UsdtRate = usdtRateModel(sequelize, Sequelize.DataTypes)

// Initialize models
const initializeModels = () => {
  console.log(`Imported ${Object.keys(db).length} models`)
  for (const modelName of Object.keys(db)) {
    console.log(`Associating ${modelName}`)
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  }
};

initializeModels()

db.sequelize = sequelize
db.Sequelize = Sequelize
export default db
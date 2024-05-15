import db from "../db/index.js";
// import { logger } from "../app";
// import { initSiteSetting } from "../services/site_setting.service";
// import { PaymentService } from "../services/payment.service";
// import { initAllStates } from "../services/states.service";
// import { initAllCountry } from "../services/country.service";
/**
 * Util for migrating db
 */
export default async function migrateDb() {
    db.sequelize
        .sync({ alter: true })
        .then(async () => {
            console.log("Database connected")
        })
        .catch((err) => {
            console.log("Unable to connect to the database: ", err)
        });
}
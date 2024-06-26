import { CronJob } from "cron";
import { updateAdminYesterdayPayinTx, updateAdminYesterdayPayoutTx, updateUserYesterdayPayinTx, updateUserYesterdayPayoutTx } from "../crons/index.js";

/**
 * Every 1 day cron jobs
 * @param {Function} callback
 * @returns {CronJob}
 * @see {@link https://www.npmjs.com/package/cron}
 */
const Every1DayCronJob = new CronJob("0 0 0 */1 * *", async () => {
    try {
        await updateAdminYesterdayPayinTx()
        await updateAdminYesterdayPayoutTx()
        await updateUserYesterdayPayinTx()
        await updateUserYesterdayPayoutTx()

    } catch (err) {
        logger.error(`Every1DayCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata")

const Every30SecondsCronJob = new CronJob("*/30 * * * * *", async () => {
    try {


    } catch (err) {
        logger.error(`Every30SecondsCronJob ${err}`)
    }

}, null, true, "Asia/Kolkata");



// export all cron jobs
export default () => {
    Every30SecondsCronJob;
    Every1DayCronJob;
};

import { razorpayCallbackService, razorpayPayoutCallbackService } from "./services.js";

async function callbackRoutes(fastify, options) {
   //payin callbacks
  fastify.post("/razorpayPayin", async (request, reply) => {
    let details = request?.body
    // console.log('detailssssssss',details)
    if (
      details?.id
    ) {
      // let paymentData = details?.payload?.payment_link?.entity;
      // paymentData.rrn = details?.payload?.payment?.entity?.acquirer_data?.rrn;
      // paymentData.upi_transaction_id =
      //   details?.payload?.payment?.entity?.acquirer_data?.upi_transaction_id;
      // console.log(paymentData);
      try {
        const response = await razorpayCallbackService(details);
        return reply.status(200).send(response);
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ message: err });
      }
    } else {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });

  //payout callbacks
  fastify.post("/razorpayPayout", async (request, reply) => {
    let details = request?.body
     //console.log('detailssssssss payout',details?.payload?.payout?.entity)
     console.log(details)
     let data =details?.payload?.payout?.entity
    if (
      data?.status=='processed'||"failed"
    ) {
      
      try {
        const response = await razorpayPayoutCallbackService(data)
        return reply.status(200).send(response);
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ message: err });
      }
    } else {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

export default callbackRoutes;

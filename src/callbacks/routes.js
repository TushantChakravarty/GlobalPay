import { razorpayCallbackService } from "./services";

async function callbackRoutes(fastify, options) {
  fastify.post("/razorpayPayin", async (request, reply) => {
    if (
      details?.payload?.payment_link?.entity &&
      details?.payload?.payment?.entity?.acquirer_data?.rrn &&
      details?.payload?.payment?.entity?.acquirer_data?.upi_transaction_id
    ) {
      let paymentData = details?.payload?.payment_link?.entity;
      paymentData.rrn = details?.payload?.payment?.entity?.acquirer_data?.rrn;
      paymentData.upi_transaction_id =
        details?.payload?.payment?.entity?.acquirer_data?.upi_transaction_id;
      console.log(paymentData);
      try {
        const response = await razorpayCallbackService(request.body);
        return reply.status(200).send(response);
      } catch (err) {
        fastify.log.error(err);
        return reply.status(500).send({ message: "Internal Server Error" });
      }
    } else {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

export default callbackRoutes;

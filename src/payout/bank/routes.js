import { createRazorpayPayoutService } from "../../gateways/razorpay/razorpayService.js"
import { neftTransfer } from "./neftServices.js"

async function payoutBankRoutes(fastify, options) {
  fastify.get('/', async (request, reply) => {
    return { hello: 'neft' }
  })

  fastify.get('/neft/transfer', async (request, reply) => {
    const response = await neftTransfer()
    return { hello: response }
  })


  fastify.post('/razorpay/payout', async (request, reply) => {

    const response = await createRazorpayPayoutService(request.body, request.body.type)
    return reply.status(200).send(response)
  })

}


// {
//   "name": "Shubhashu",
//   "email": "tshubhanshu007@gmail.com",
//   "contact": 8318089088,
//   "type": "employee",
//   "reference_id": "Acme Contact ID 12345",
//   "notes":{
//     "random_key_1": "Make it so.",
//     "random_key_2": "Tea. Earl Grey. Hot."
//   }
// }

// {
//   "contact_id": "cont_ODRssBvRJVMn1y",
//   "account_type": "bank_account",
//   "bank_account": {
//      "name":"shubhanshu tripathi",
//     "ifsc": "HDFC0009107",
//     "account_number": "50100102283912"
//   }
// }
// {
//   "account_number": "2323230037526232",
//   "fund_account_id": "fa_ODRtRd1lmaaPZg",
//   "amount": 100,
//   "currency": "INR",
//   "mode": "IMPS",
//   "purpose": "refund",
//   "queue_if_low_balance": true,
//   "reference_id": "Acme Transaction ID 12345",
//   "narration": "Acme Corp Fund Transfer",
//   "notes": {
//     "notes_key_1":"Tea, Earl Grey, Hot",
//     "notes_key_2":"Tea, Earl Grey… decaf."
//   }
// }

export default payoutBankRoutes;
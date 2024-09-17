/**
 * This webhook URL is meant to handle **successful** payment requests
 * from the paystack api. For failed/declined transactions, look at ...
 */
import crypto from 'crypto'

export async function POST(req: Request) {
  const requestBody = await req.json()

  // create hash to verify incoming request
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_TEST_SECRET!)
    .update(JSON.stringify(requestBody))
    .digest('hex')

  const hashMatchesPaystackSignature =
    hash === req.headers.get('x-paystack-signature')

  if (hashMatchesPaystackSignature) {
    const payload = requestBody?.data
    console.log('Paystack event: ', requestBody?.event)
    console.log('Payload: ', payload)

    // ? Important Payload info
    // payload.status: 'success' | '' | ''
    // payload.reference: string
    // payload.amount: number
    // payload.currency: string
    // payload.customer: Object
    // payload.paidAt: Date ISO String
    // payload.fees: number
    // payload.metadata: JSON
    // payload.authorization (card info): Object

    // ? Next steps
    // store trx reference in transactions DB and add correlation to user records
    // send payment confirmation email
    // trigger the order fuffilment flow
    // reduce purchased item stock in product DB
    // redirect to successful order screen (throw confetti🎉)

    // * Advanced:
    // save this information to system logs
    // update analytics system
    // update backup DB with new info (cron job task anyways)

    return new Response('Successful transaction', { status: 200 })
  } else {
    return new Response('Could not verify initiator', { status: 401 })
  }
}

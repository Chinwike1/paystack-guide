export async function POST(req: Request) {
  const { first_name, last_name, email, amount } = await req.json()
  console.log(process.env.PAYSTACK_TEST_SECRET)

  // TODO:
  // - Add Metadata
  // - Retreive trx reference and ...

  const txn_url = 'https://api.paystack.co/transaction'
  const res = await fetch(`${txn_url}/initialize`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.PAYSTACK_TEST_SECRET,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amount * 100,
    }),
  })
  const response = await res.json()
  console.log('response: ', response)

  return new Response(JSON.stringify(response), { status: 200 })
}

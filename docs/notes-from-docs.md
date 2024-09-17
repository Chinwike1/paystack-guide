# Notes about the paystack docs

This file contains notes/observations I made from the paystack documentation while creating this sample project.

## Goals/Features

- [x] Initialize a transaction on the client
- [x] Charge customer
- [x] Verify successful transaction
- [ ] Allow different payment methods — Debit card, Bank Transfer, USSD.
- [ ] Handle failed transactions, disputes & refunds
- [ ] Store transactions (failed & successful) to a database table with the necessary metadata (customer data, cart items, cart id, payment medium (web or mobile), payment channel)

## Table of Contents

## Initialize a transaction on the client

[Paystack Compliance requirements](https://support.paystack.com/hc/en-us/articles/360009973819-What-are-the-requirements-for-enabling-international-payments-for-my-business)

**Important parameters:**

- Customer's input:
  - **_`email`_**
  - **_`amount`_**
  - `currency`
  - `first name`
  - `last name`
  - `plan`
  - `transaction reference`
  - `metadata`: you should collect metadata about each transaction that can give you insight into ... Paystack also provides custom_fields that show up on the Paystack dashboard.

| Currency Code | Subunit | Trx_amount in (Parent Unit) | Value      |
| ------------- | ------- | --------------------------- | ---------- |
| NGN           | Kobo    | 20,000                      | 20,000,000 |
| USD           | Cent    | 49                          | 4,900      |
| GHS           | Pesewa  | 500                         | 50,000     |

## Rules for implementing Paystack securely

- **Rookie mistake**: Do not use your secret key in your frontend
  Never call the Paystack API directly from your frontend to avoid exposing your secret key on the frontend. All requests to the Paystack API should be initiated from your server, and your frontend gets the response from your server.
- Accepting payments with a card requires your business to be PCI compliant by a QSA. QSA for Africans is []()

## The Action Cycle

1. Collect customer's input
2. Send `POST` request to Paystack's [ChargeAPI](https://paystack.com/docs/api/charge/#charges)
3. The [Charge API](#paramenters-of-the-charge-api) lets you configure the payment channel(s) your application is accepting
4. Handle Webhook
   - Provision a publicly available **`POST`** endpoint Paystack can call
   - Add it to your Paystack dashboard
   - On the server, verify event origin with the `x-paystack-signature` header
   - Parse event object from request sent by Paystack
   - Return a `200` response to acknowledge
   - Paystack keeps pinging for 72 hours

### Paramenters of the Charge API

- `pending`: check this boolean value **every 10secs** to verify the status of the transaction.
- `timeout`: Transaction has failed. You may start a new charge after showing data.message to user
- `success`: Transaction is successful. You can now provide value
  send_birthday Customer's birthday is needed to complete the transaction. Show data.display_text to user with an input that accepts the birthdate and submit to the Submit BirthdayAPI endpoint with reference and birthday
- `send_otp`: Paystack needs OTP from customer to complete the transaction. Show data.display_text to user with an input that accepts OTP and submit the OTP to the Submit OTPAPI endpoint with reference and otp
- `failed`: Transaction failed. No remedy for this, start a new charge after showing data.message to user

## Webhooks

Paystack only hits your webhook URL for **successful transactions** `event === 'charge.success'`. Sample webhook response:

```javascript
  Request Body:  {
    event: 'charge.success',
    data: {
      id: 4150371305,
      domain: 'test',
      status: 'success',
      reference: 'wj4j7b0405',
      amount: 200000,
      message: null,
      gateway_response: 'Successful',
      paid_at: '2024-09-06T16:36:38.000Z',
      created_at: '2024-09-06T16:36:31.000Z',
      channel: 'card',
      currency: 'NGN',
      ip_address: '31.2*5.2**.*2',
      metadata: '',
      fees_breakdown: null,
      log: null,
      fees: 3000,
      fees_split: null,
      authorization: {
        authorization_code: 'AUTH_f6wk6qves2',
        bin: '408408',
        last4: '4081',
        exp_month: '12',
        exp_year: '2030',
        channel: 'card',
        card_type: 'visa ',
        bank: 'TEST BANK',
        country_code: 'NG',
        brand: 'visa',
        reusable: true,
        signature: 'SIG_HI2DgDhHy9Vh6VsmGpBn',
        account_name: null
      },
      customer: {
        id: 167565827,
        first_name: null,
        last_name: null,
        email: 'johndoe@gmail.com',
        customer_code: 'CUS_x3qce71k6qj25ft',
        phone: null,
        metadata: null,
        risk_action: 'default',
        international_format_phone: null
      },
      plan: {},
      subaccount: {},
      split: {},
      order_id: null,
      paidAt: '2024-09-06T16:36:38.000Z',
      requested_amount: 200000,
      pos_transaction_data: null,
      source: {
        type: 'api',
        source: 'merchant_api',
        entry_point: 'transaction_initialize',
        identifier: null
      }
    }
}
```

'use client'
import { useTransition, useState } from 'react'
import { HeartIcon, Loader2 } from 'lucide-react'

export default function Home() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState(null)

  async function initiatePayment() {
    const email = 'johndoe@gmail.com'
    const amount = 500000

    startTransition(async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/paystack/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            amount,
          }),
        })

        if (!res.ok) {
          throw new Error('Error initiating payment request')
        }

        const data = await res.json()
        window.open(data.data.authorization_url)
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <div className='min-h-screen space-y-7 flex flex-col items-center justify-center'>
      <div className='bg-[#1C1C1E] rounded-lg shadow-sm size-56'></div>
      <button
        onClick={initiatePayment}
        disabled={isPending}
        className='px-5 py-3 bg-emerald-500 active:scale-95 hover:bg-emerald-600 transition-all active:bg-emerald-600 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isPending ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Processing...
          </>
        ) : (
          'Buy with Paystack'
        )}
      </button>
      {error && <p className='text-red-500'>{error}</p>}
      <small className='group flex w-fit items-center'>
        Made with{' '}
        <HeartIcon className='mx-1 size-4 transition-colors duration-500 ease-in-out group-hover:text-rose-600' />{' '}
        by Chinwike
      </small>
    </div>
  )
}

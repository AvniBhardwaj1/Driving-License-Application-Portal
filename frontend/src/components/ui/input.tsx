import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      className={[
        'min-h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-trust-blue-600 focus:ring-2 focus:ring-trust-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus:ring-red-600/20',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      ref={ref}
      {...props}
    />
  )
})

import type { HTMLAttributes } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <section
      className={['rounded-xl border border-slate-200 bg-white shadow-sm', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={['p-6 pb-0 sm:p-8 sm:pb-0', className].filter(Boolean).join(' ')} {...props} />
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={['p-6 sm:p-8', className].filter(Boolean).join(' ')} {...props} />
}

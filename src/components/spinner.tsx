import { clsx } from 'clsx'

export function Spinner({ className }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        'h-4 w-4 animate-spin border-current border-r-2 rounded-[50%] box-border inline-block',
        className
      )}
    ></span>
  )
}

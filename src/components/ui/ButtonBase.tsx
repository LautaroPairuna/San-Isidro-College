import React, { memo } from 'react'
import clsx from 'clsx'

type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'danger'
}

export default memo(function ButtonBase({ variant = 'default', children, className, ...props }: ButtonBaseProps) {
  return (
    <button
      {...props}
      className={clsx(
        'px-6 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-indigo-500',
        {
          'bg-indigo-600 hover:bg-indigo-700 text-white': variant === 'default',
          'bg-red-500 hover:bg-red-600 text-white': variant === 'danger',
        },
        className
      )}
    >
      {children}
    </button>
  )
})

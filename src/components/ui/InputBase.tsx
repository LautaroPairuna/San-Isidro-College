import React, { memo } from 'react'
import clsx from 'clsx'

type InputBaseProps = React.InputHTMLAttributes<HTMLInputElement>

export default memo(function InputBase(props: InputBaseProps) {
  return (
    <input
      {...props}
      className={clsx(
        'px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400',
        props.className
      )}
    />
  )
})

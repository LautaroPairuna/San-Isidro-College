import React, { memo } from 'react'
import clsx from 'clsx'

type SelectBaseProps = React.SelectHTMLAttributes<HTMLSelectElement>

export default memo(function SelectBase(props: SelectBaseProps) {
  return (
    <select
      {...props}
      className={clsx(
        'px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400',
        props.className
      )}
    />
  )
})

import { useState } from 'react'
import { Switch } from '@headlessui/react'
import classNames from 'classnames'

export default function Toggle () {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={classNames(
        enabled ? 'bg-yellow-600' : 'bg-gray-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform bg-white shadow ring-0 transition duration-200 ease-in-out'
        )}
      />
    </Switch>
  )
}

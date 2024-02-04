import { Switch } from '@headlessui/react'
import classNames from 'classnames'

interface ToggleProps {
  className?: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

const Toggle = ({ className, enabled, onToggle }: ToggleProps) => {

  return (
    <Switch
      checked={enabled}
      onChange={onToggle}
      className={classNames(
        enabled ? 'bg-yellow-600' : 'bg-gray-200',
        className,
        'relative inline-flex h-7 w-20 flex-shrink-0 rounded-xl cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2'
      )}
    > 
      <span className="absolute left-0 inset-y-0 flex items-center pl-1">
        ON
      </span>
      <span className="absolute right-0 inset-y-0 flex items-center text-black">
        OFF
      </span>
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-9' : 'translate-x-0',
          'pointer-events-none inline-block h-6 w-10 rounded-xl transform bg-neutral-900 shadow ring-0 transition duration-200 ease-in-out'
        )}
      >
      </span>
    </Switch>
  )
}

export default Toggle
import { Switch } from '@headlessui/react'
import { PauseIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

interface ToggleProps {
  className?: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export const Toggle = ({ className, enabled, onToggle }: ToggleProps) => {

  return (
    <Switch
      checked={enabled}
      onChange={onToggle}
      className={classNames(
        enabled ? 'from-amber-300 to-amber-600' : 'from-neutral-800 to-neutral-700',
        className,
        'bg-gradient-to-l relative inline-flex h-8 w-20 flex-shrink-0 rounded-2xl cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-none'
      )}
    > 
      <span className="absolute left-1 inset-y-0 flex items-center pl-1 text-black">
        On
      </span>
      <span className="absolute right-2 inset-y-0 flex items-center text-black">
        Off
      </span>
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
          enabled ? 'translate-x-9' : 'translate-x-1',
          'pointer-events-none translate-y-0.5 inline-block h-7 w-10 rounded-2xl transform bg-neutral-900 shadow ring-0 transition duration-200 ease-in-out'
        )}
      >
        <PauseIcon className="h-5 w-5 mx-auto mt-1 font-bold text-neutral-600 shadow-card" aria-hidden="true" />
      </span>
    </Switch>
  )
}
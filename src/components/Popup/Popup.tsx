import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PopupProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Popup = ({ open, setOpen, children, className }: PopupProps) => {
  const classes = classNames("relative transform overflow-hidden rounded-lg bg-gradient-to-tl-theme px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 z-50", className);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay onClick={() => setOpen(false)}>
            <div className="fixed inset-0 bg-theme-background bg-opacity-75 transition-opacity" onClick={() => setOpen(false)}/>
          </Dialog.Overlay>
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center !pl-72 p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={classes}>
                <div>
                  <XMarkIcon className="h-6 w-6 absolute top-4 right-4 text-theme-text cursor-pointer" onClick={() => setOpen(!open)} />
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

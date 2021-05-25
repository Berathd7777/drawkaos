import { useToast, UseToastOptions } from '@chakra-ui/react'
import React, { createContext, ReactNode, useContext } from 'react'

type ToastContextState = {
  showToast: (opts: UseToastOptions) => string | number
  updateToast: (
    toastId: UseToastOptions['id'],
    opts: Omit<UseToastOptions, 'id'>
  ) => void
}

const ToastContext = createContext<ToastContextState>(undefined)

type Props = {
  children: ReactNode
}

function ToastProvider({ children }: Props) {
  const toast = useToast({
    duration: 5000,
    isClosable: true,
    position: 'top-right',
    variant: 'solid',
  })

  const showToast = (opts: UseToastOptions) => {
    toast.closeAll()

    return toast({
      status: 'info',
      ...opts,
    })
  }

  const updateToast = (
    toastId: UseToastOptions['id'],
    opts: Omit<UseToastOptions, 'id'>
  ) => toast.update(toastId, opts)

  return (
    <ToastContext.Provider value={{ showToast, updateToast }}>
      {children}
    </ToastContext.Provider>
  )
}

function useToasts() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToasts must be used within <ToastProvider />.')
  }

  return context
}

export { ToastProvider, useToasts }

import { useToast, UseToastOptions } from '@chakra-ui/react'

export function useToasts() {
  const toast = useToast({
    duration: 5000,
    isClosable: true,
    position: 'bottom-left',
  })

  const showToast = (opts: UseToastOptions) =>
    toast({
      status: 'info',
      ...opts,
    })

  const updateToast = (
    toastId: UseToastOptions['id'],
    opts: Omit<UseToastOptions, 'id'>
  ) => toast.update(toastId, opts)

  return {
    showToast,
    updateToast,
  }
}

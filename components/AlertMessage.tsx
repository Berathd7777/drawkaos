import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
} from '@chakra-ui/react'
import React, { ReactNode } from 'react'

type Props = {
  status: AlertProps['status']
  title?: ReactNode
  description?: ReactNode
}

export function AlertMessage({ status, title, description }: Props) {
  return (
    <Alert status={status} variant="solid" borderRadius="md">
      <AlertIcon />
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  )
}

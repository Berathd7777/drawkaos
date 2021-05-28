import { Button } from '@chakra-ui/react'
import { useToasts } from 'contexts/Toasts'
import React, { useEffect, useRef } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { MdContentCopy } from 'react-icons/md'

type Props = {
  text: string
}

export function CopyInviteLink({ text }: Props) {
  const { showToast } = useToasts()
  const initialFocusRef = useRef<HTMLButtonElement>()

  useEffect(() => {
    if (initialFocusRef.current) {
      initialFocusRef.current.focus()
    }
  }, [])

  const showToastOnCopy = () => {
    showToast({
      description: 'Copied!',
      status: 'success',
    })
  }

  return (
    <CopyToClipboard text={text} onCopy={showToastOnCopy}>
      <Button
        colorScheme="primary"
        variant="ghost"
        leftIcon={<MdContentCopy />}
        ref={initialFocusRef}
      >
        Copy invite link
      </Button>
    </CopyToClipboard>
  )
}

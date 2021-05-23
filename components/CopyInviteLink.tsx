import { Button } from '@chakra-ui/react'
import { useToasts } from 'hooks/useToasts'
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { MdContentCopy } from 'react-icons/md'

type Props = {
  text: string
}

export function CopyInviteLink({ text }: Props) {
  const { showToast } = useToasts()

  const showToastOnCopy = () => {
    showToast({
      description: 'Copied!',
      status: 'success',
    })
  }

  return (
    <CopyToClipboard text={text} onCopy={showToastOnCopy}>
      <Button
        colorScheme="tertiary"
        variant="outline"
        leftIcon={<MdContentCopy />}
      >
        Copy invite link
      </Button>
    </CopyToClipboard>
  )
}

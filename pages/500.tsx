import { AlertMessage } from 'components/AlertMessage'
import React from 'react'

function Custom500() {
  return <AlertMessage status="error" title="Server-side error occurred." />
}

export default Custom500

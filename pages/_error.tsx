import { AlertMessage } from 'components/AlertMessage'
import React from 'react'

function ErrorPage() {
  return <AlertMessage status="error" title="An error occurred." />
}

export default ErrorPage

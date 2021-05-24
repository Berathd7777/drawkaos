import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          {process.env.NODE_ENV === 'production' && (
            <script
              async
              defer
              src="https://beampipe.io/js/tracker.js"
              data-beampipe-domain="garlicphone.vercel.app"
            />
          )}
        </body>
      </Html>
    )
  }
}

export default MyDocument

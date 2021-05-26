import { ChakraProvider } from '@chakra-ui/react'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import { Layout } from 'components/Layout'
import { SoundProvider } from 'contexts/Sounds'
import { ToastProvider } from 'contexts/Toasts'
import { DefaultSeo } from 'next-seo'
import SEO from 'next-seo.config'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import 'styles/styles.css'
import theme from 'styles/theme'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...SEO} />
      <Head>
        <title>Garlic phone</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,user-scalable=no"
        />
      </Head>
      <ChakraProvider theme={theme}>
        <ToastProvider>
          <SoundProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SoundProvider>
        </ToastProvider>
      </ChakraProvider>
    </>
  )
}

export default App

import { NextSeoProps } from 'next-seo'

const TITLE = 'gartic-phone'
const DESCRIPTION = 'gartic-phone'
const BASE_URL = 'https://gartic-phone.com'

const SEO: NextSeoProps = {
  title: TITLE,
  description: DESCRIPTION,
  canonical: BASE_URL,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    title: TITLE,
    description: DESCRIPTION,
    site_name: TITLE,
    images: [{ url: `${BASE_URL}/social.jpg`, alt: TITLE }],
  },
  twitter: {
    handle: '@gartic-phone',
    cardType: 'summary_large_image',
  },
}

export default SEO

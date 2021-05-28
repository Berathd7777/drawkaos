import { NextSeoProps } from 'next-seo'

const TITLE = 'Garlic phone'
const DESCRIPTION = 'Garlic phone'
const BASE_URL = 'https://garlicphone.vercel.app'

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
    images: [{ url: `${BASE_URL}/social.jpeg`, alt: TITLE }],
  },
  twitter: {
    handle: '@durancristhian@gmail.com',
    cardType: 'summary_large_image',
  },
}

export default SEO

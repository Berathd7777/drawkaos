import { NextSeoProps } from 'next-seo'

const TITLE = 'coronaprisma'
const DESCRIPTION = 'coronaprisma'
const BASE_URL = 'https://coronaprisma.com'

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
    handle: '@coronaprisma',
    cardType: 'summary_large_image',
  },
}

export default SEO

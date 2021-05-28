module.exports = {
  future: {
    webpack5: true,
  },
  webpack(config, { dev, isServer }) {
    /*
      https://santosnicolas.com/notes/next-js-optimized-with-preact
    */
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      })
    }

    return config
  },
}

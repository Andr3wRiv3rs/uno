module.exports = function(config) {
  config.devServer.proxy = [
    {
      path: '/api/**',
      target: 'http://localhost:8000/api',
      changeOrigin: true,
      changeHost: true,

      pathRewrite(path, req) {
        delete req.headers.referer

        return `/${  path.replace(/^\/[^\/]+\//, '')}`
      },

      onProxyRes(proxyRes) {
        proxyRes.headers.connection = 'keep-alive'
        proxyRes.headers['cache-control'] = 'no-cache'
      },
    },
  ]
}

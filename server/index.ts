import SourceMapSupport from 'source-map-support'

SourceMapSupport.install()

process.on('message', (message) => {
  if (message === 'exit') process.exit()
  console.log(message)
})

process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)

import './router'

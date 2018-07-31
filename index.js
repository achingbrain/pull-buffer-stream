'use strict'

const crypto = require('crypto')

const defaultOptions = {
  chunkSize: 4096,
  collector: () => {},
  generator: (size, callback) => {
    setImmediate(() => {
      callback(null, crypto.randomBytes(size))
    })
  }
}

const bufferStream = (limit, options = {}) => {
  options = Object.assign({}, defaultOptions, options)
  let emitted = 0

  return (error, callback) => {
    if (error) {
      console.info('how did I get here?', error)

      return callback(error)
    }

    const nextLength = emitted + options.chunkSize
    let nextChunkSize = options.chunkSize

    if (nextLength > limit) {
      // emit the final chunk
      nextChunkSize = limit - emitted
    }

    if (nextChunkSize < 1) {
      // we've emitted all requested data, end the stream
      return callback(true) // eslint-disable-line standard/no-callback-literal
    }

    options.generator(nextChunkSize, (error, bytes) => {
      if (!error) {
        options.collector(bytes)
        emitted += nextChunkSize
      }

      callback(error, bytes)
    })
  }
}

module.exports = bufferStream

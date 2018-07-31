'use strict'

const crypto = require('crypto')
const pull = require('pull-stream/pull')
const values = require('pull-stream/sources/values')
const asyncMap = require('pull-stream/throughs/async-map')

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

  const arr = []
  arr.length = Math.ceil(limit / options.chunkSize)

  return pull(
    values(arr),
    asyncMap((_, callback) => {
      const nextLength = emitted + options.chunkSize
      let nextChunkSize = options.chunkSize

      if (nextLength > limit) {
        // emit the final chunk
        nextChunkSize = limit - emitted
      }

      options.generator(nextChunkSize, (error, bytes) => {
        if (error) {
          return callback(error)
        }

        bytes = bytes.slice(0, nextChunkSize)

        options.collector(bytes)
        emitted += nextChunkSize

        callback(null, bytes)
      })
    })
  )
}

module.exports = bufferStream

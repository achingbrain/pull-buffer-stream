# pull-buffer-stream

> Emits streams of buffers

## Install

```sh
$ npm install --save pull-buffer-stream
```

## Usage

Generate streams of buffers containing bytes up to a certain length:

```javascript
const pull = require('pull-stream')
const bufferStream = require('pull-buffer-stream')

const totalLength = //... a big number

pull(
  bufferStream(totalLength, {
    chunkSize: 4096, // how many bytes will be in each buffer
    collector: (buffer) => {
      // will be called as each buffer is generated
    },
    generator: (size, callback) => {
      // generate some bytes and pass them to callback in the `callback(error, bytes)` style
    }
  }),
  pull.collect((error, buffers) => {
    // `buffers` is an array of Buffers the combined length of which === totalLength
  })
)
```

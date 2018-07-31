# pull-buffer-stream

> Emits streams of buffers

## Install

```sh
$ npm install --save pull-buffer-stream
```

## Usage

Generate streams of buffers containing bytes up to a certain length:

```javascript
const pull = require('pull-stream')
const bufferStream = require('pull-buffer-stream')

const totalLength = //... a big number

// all options are optional, defaults are shown
const options = {
  chunkSize: 4096, // how many bytes will be in each buffer
  collector: (buffer) => {
    // will be called as each buffer is generated. the final buffer
    // may be smaller than `chunkSize`
  },
  generator: (size, callback) => {
    // generate a buffer of length `size` and pass it to the callback in
    // the `callback(error, buffer)` style
    //
    // if omitted, `crypto.randomBytes(size)` will be used
  }
}

pull(
  bufferStream(totalLength, options),
  pull.collect((error, buffers) => {
    // `buffers` is an array of Buffers the combined length of which === totalLength
  })
)
```

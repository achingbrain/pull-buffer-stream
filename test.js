import bufferStream from './'
import test from 'ava'
import pull, {
  collect,
  once,
  map
} from 'pull-stream'

test.cb('Should emit bytes', (t) => {
  const expected = 100

  pull(
    bufferStream(expected),
    collect((error, buffers) => {
      t.falsy(error)
      t.is(buffers.length, 1)
      t.is(buffers[0].length, expected)
      t.end()
    })
  )
})

test.cb('Should emit a number of buffers', (t) => {
  const expected = 100
  const chunkSize = 10

  pull(
    bufferStream(expected, {
      chunkSize
    }),
    collect((error, buffers) => {
      t.falsy(error)
      t.is(buffers.length, 10)
      t.is(buffers[0].length, expected / chunkSize)

      const total = buffers.reduce((acc, cur) => acc + cur.length, 0)

      t.is(expected, total)

      t.end()
    })
  )
})

test.cb('Should allow collection of buffers', (t) => {
  const expected = 100
  let buf = Buffer.alloc(0)

  pull(
    bufferStream(expected, {
      collector: (buffer) => {
        buf = Buffer.concat([buf, buffer])
      }
    }),
    collect((error, buffers) => {
      t.falsy(error)
      t.deepEqual(buf, buffers[0])

      t.end()
    })
  )
})

test.cb('Should allow generation of buffers', (t) => {
  const expected = 100
  let buf = Buffer.alloc(0)

  pull(
    bufferStream(expected, {
      generator: (size, callback) => {
        const output = Buffer.alloc(size, 1)
        buf = Buffer.concat([buf, output])

        callback(null, output)
      }
    }),
    collect((error, buffers) => {
      t.falsy(error)
      t.deepEqual(buf, buffers[0])

      t.end()
    })
  )
})

test.cb('Should proagate byte generation errors', (t) => {
  const generationError = new Error('Urk!')

  pull(
    bufferStream(5, {
      generator: (size, callback) => {
        callback(generationError)
      }
    }),
    collect((error) => {
      t.is(error, generationError)

      t.end()
    })
  )
})

test.cb('Should proagate previous stream errors', (t) => {
  const streamError = new Error('Urk!')

  pull(
    bufferStream(5),
    map(() => {
      throw streamError
    }),
    collect((error) => {
      t.is(error, streamError)

      t.end()
    })
  )
})

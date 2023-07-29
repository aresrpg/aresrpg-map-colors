import { nearestMatch } from '../src/mapColors.js'
import { ComputeColors, ComputeKnown } from '../src/minecraftTransform.js'
import { Readable, Writable } from 'stream'
import assert from 'assert'
import test from 'node:test'

test('The nearest match function', ctx => {
  ctx.test('should return the closest minecraft compatible color', () => {
    assert.equal(nearestMatch(89, 125, 39), 4)
  })
})

test('The computeColors transform stream', async ctx => {
  const image = 'https://i.imgur.com/nAcX5cX.png'
  const amount = 5
  let count = 0

  await ctx.test(
    'The computeKnown transform stream',
    async sub_ctx =>
      new Promise(resolve =>
        new ReadImage(image, amount)
          .pipe(new ComputeColors())
          .pipe(new ComputeKnown())
          .pipe(
            new WriteTest(c => {
              const { skip, chunk } = c
              if (!count) assert.ok(chunk, 'chunk should be truthy')
              else assert.ok(skip, 'any other frames should be skipped')
              count++
              if (count >= amount) resolve()
            })
          )
      )
  )
})

class ReadImage extends Readable {
  constructor(image, amount) {
    super()
    this.image = image
    this.amount = amount
    this.count = 0
  }

  _read() {
    if (this.count < this.amount) this.push(this.image)
    else this.push(null)
    this.count++
  }
}

class WriteTest extends Writable {
  constructor(callback) {
    super({ objectMode: true })
    this.callback = callback
  }

  _write(chunk, _, done) {
    this.callback(chunk)
    done()
  }
}

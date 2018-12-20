import { nearestMatch } from '../src/mapColors'
import tape from 'blue-tape'
import { ComputeColors, ComputeKnown } from '../src/minecraftTransform'
import { Readable, Writable } from 'stream'
import Deferred from '../src/deferredPromise'

tape('Nearest match should return the closest minecraft compatible color', async t => {
	return t.equal(nearestMatch(89, 125, 39), 4, `${nearestMatch(89, 125, 39)} should be 4`)
})

tape('Next frame should be skipped if the last was exactly the same', async t => {
	const def = new Deferred()
	const image = 'https://i.imgur.com/nAcX5cX.png'
	const amount = 5

	const r = new ReadImage(image, amount)
	let count = 0

	r.pipe(new ComputeColors())
		.pipe(new ComputeKnown())
		.pipe(
			new WriteTest(c => {
				const { skip, chunk } = c
				if (!count) t.ok(chunk, 'The first frame should be there')
				else t.ok(skip, 'any other frames should be skipped')
				count++
				if (count >= amount) def.resolve()
			}),
		)
	return await def.promise
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

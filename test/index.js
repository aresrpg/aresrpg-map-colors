import { nearestMatch } from '../src/mapColors'
import { ComputeColors, ComputeKnown } from '../src/minecraftTransform'
import { Readable, Writable } from 'stream'
import '@hydre/doubt'

'The nearest match function'.doubt(()=> {
	'should return the closest minecraft compatible color'.because(nearestMatch(89, 125, 39)).isEqualTo(4)
})

'The computeKnown transform stream'.doubt(async ()=> {
	const image = 'https://i.imgur.com/nAcX5cX.png'
	const amount = 5
	let count = 0

	await new Promise(resolve => new ReadImage(image, amount)
	|> #.pipe(new ComputeColors())
	|> #.pipe(new ComputeKnown())
	|> #.pipe(new WriteTest(c => {
		const { skip, chunk } = c
		if (!count) 'should only allow the first frame'.because(chunk).isTrue()
		else 'should skip any other frames'.because(skip).isTrue()
		count++
		if (count >= amount) resolve()
	})))
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

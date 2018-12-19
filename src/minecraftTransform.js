import { Transform } from 'stream'
import MapColor from './mapColors'

export class ComputeColors extends Transform {
	constructor() {
		super()
	}

	// buffer to id array
	_transform(chunk, _, next) {
		MapColor.fromImage(chunk)
			.then(this.push)
			.then(next)
	}
}

export class ComputeKnown extends Transform {
	constructor(width, height) {
		super({ readableObjectMode: true })
		Object.assign(this, { width, height })
		this.last = new Uint8Array(width * height)
	}

	_transform(chunk, _, next) {
		let columns = {}
		let rows = {}
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++) {
				const index = x + this.width * y
				if (chunk[index] !== this.last[index]) {
					if (!columns.start) columns.start = x
					if (!rows.start) rows.start = y
					if (!rows.end || y > rows.end) rows.end = y
					columns.end = x
				}
			}
		if (columns.start) {
			const column = columns.end - columns.start || 1 // if only one column updated then we take 1
			const row = rows.end - rows.start || 1
			const x = column.start
			const y = rows.start
			this.push({ column, row, x, y, chunk })
		}
		next()
	}
}

export class Framerate extends Transform {
	constructor(fps) {
		super()
		this.limit = 1000 / fps
		this.last = Date.now()
	}

	_transform(chunk, _, next) {
		if (Date.now() - this.last > this.limit) {
			this.push(chunk)
			this.last = Date.now()
		}
		next()
	}
}

export async function* nextFrame(stream) {
	for await (let chunk of stream) yield chunk
}

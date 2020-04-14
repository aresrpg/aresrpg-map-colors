import { Transform } from 'stream'
import { fromImage } from './mapColors'
import cwise from 'cwise'
import ndarray from 'ndarray'

export class ComputeColors extends Transform {
	constructor() {
		super({ readableObjectMode: true })
	}
	// buffer to id ndArray
	async _transform(chunk, _, next) {
		const { width, height, datas } = await fromImage(chunk.toString('utf8')) // TODO find which imput i should listen for
		this.push(ndarray(datas, [width, height]))
		next()
	}
}

// ndarray to ndarray
export class ComputeKnown extends Transform {
	constructor() {
		super({ objectMode: true })
	}

	compute = cwise({
		args: ['index', 'array', 'array'],
		pre: function() {
			this.start = 0
			this.end = 0
		},
		body: function(index, last, curr) {
			// doesn't transpile :(
			const x = index[0]
			const y = index[1]
			if (last !== curr) {
				if (!this.start) this.start = { x: x, y: y }
				this.end = { x: x + 1, y: y + 1 }
			}
		},
		post: function() {
			if (this.start) return { start: this.start, end: this.end }
		},
	})

	_transform(_chunk, _, next) {
		if (!this.last) this.push({ x: 0, y: 0, chunk: _chunk })
		else {
			const { start, end } = this.compute(this.last, _chunk) || {}
			const { x: startX, y: startY } = start || {}
			const { x: endX, y: endY } = end || {}
			const chunk = start ? _chunk.lo(startX, startY).hi(endX - startX, endY - startY) : undefined
			this.push({ skip: !start, x: startX, y: startY, chunk }) // if start is undefined that mean there is no change and the map should be sent with column 0
		}
		this.last = _chunk
		next()
	}
}

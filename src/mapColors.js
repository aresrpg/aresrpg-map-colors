import getPixels from 'get-pixels'
import { promisify } from 'util'
import cwise from 'cwise'
import COLORS from './colors'

export COLORS

const pixels = promisify(getPixels)

const toHex = (r, g, b) => ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff)

const nearest = (r1, g1, b1) => {
	let i = 0xffffffff
	let result = 0
	// fastest iteration
	for (let reverse = COLORS.length - 1; reverse >= 0; reverse--) {
		const { r: r2, g: g2, b: b2 } = COLORS[reverse]
		const deviation = ((r2 - r1) * 0.3) ** 2 + ((g2 - g1) * 0.59) ** 2 + ((b2 - b1) * 0.11) ** 2
		if (deviation < i) {
			i = deviation
			result = reverse + 4
		}
	}
	return result
}

const matcher = () => {
	const cached = new Map()
	/**
	 * This function take a color and return the closest color according to human eyes conception available in minecraft pc
	 * @param {Number} r
	 * @param {Number} g
	 * @param {Number} b
	 * @returns the id of the closest minecraft compatible color
	 */
	return (r, g, b) => {
		const hex = toHex(r, g, b)
		let result = cached.get(hex)
		if (result === undefined) {
			result = nearest(r, g, b)
			cached.set(hex, result)
		}
		return result
	}
}

export const nearestMatch = matcher()

/**
 *
 * @param {Number} id
 * @returns an Object { r, g, b } of the color corresponding to the minecraft id
 * @see https://minecraft.gamepedia.com/Map_item_format
 */
export function color(id) {
	if (id < 4 || id > 207) throw new Error(`${id} is out of bounds`)
	return COLORS[id - 4]
}

/**
 *
 * @param {Number} id
 * @returns Hexadecimal value of the color corresponding to the minecraft id
 * @see https://minecraft.gamepedia.com/Map_item_format
 */
export function hex(id) {
	const { r, g, b } = color(id)
	return toHex(r, g, b)
}

/**
 * Take an image and return a buffer array of minecraft compatible colors
 * @param {String} path the image path (can be an url)
 * @returns an object containing an unsigned byte array of id
 */
export async function fromImage(path) {
	const img = await pixels(path)
	const [width, height] = img.shape
	const mapIds = cwise({
		args: ['scalar', 'scalar', { blockIndices: -1 }, 'scalar'],
		pre: function(w, h) {
			this.result = new Uint8Array(w * h)
			this.i = 0
		},
		body: function(w, h, a, match) {
			const r = a[0]
			const g = a[1]
			const b = a[2]
			this.result[this.i++] = match(r, g, b)
		},
		post: function() {
			return this.result
		},
	})
	return {
		width,
		height,
		datas: mapIds(width, height, img, nearestMatch),
	}
}

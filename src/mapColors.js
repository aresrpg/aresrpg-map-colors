import getPixels from 'get-pixels'
import { promisify } from 'util'

const pixels = promisify(getPixels)

export default class {
	/**
	 * This function take a color and return the closest color according to human eyes conception available in minecraft pc
	 * @param {Number} r
	 * @param {Number} g
	 * @param {Number} b
	 * @returns an Object { id, r, g, b } of the closest minecraft compatible color
	 */
	@cache
	static nearestMatch(r1, g1, b1) {
		let i = -1
		let id = 0
		let result = { id, r: 0, g: 0, b: 0 }
		for (let { r: r2, g: g2, b: b2 } of COLORS) {
			id++
			const deviation = ((r2 - r1) * 0.3) ** 2 + ((g2 - g1) * 0.59) ** 2 + ((b2 - b1) * 0.11) ** 2
			if (i === -1 || deviation < i) {
				i = deviation
				result = { id: id + 3, r: r2, g: g2, b: b2 }
			}
		}
		return result
	}

	/**
	 * Take an image and return a buffer array of minecraft compatible colors
	 * @param {String} path
	 * @returns an array [ { id, r, g, b } ]
	 */
	static async fromImage(path) {
		const { data } = await pixels(path)
		const result = []
		for (let i = 0; i < data.length; ) result.push(this.nearestMatch(data[i++], data[i++], data[i++]))
		return result
	}

	/**
	 *
	 * @param {Number} id
	 * @returns an Object { r, g, b } of the color corresponding to the minecraft id
	 * @see https://minecraft.gamepedia.com/Map_item_format
	 */
	static color(id) {
		if (id < 4 || id > 207) throw new Error(`${id} is out of bounds`)
		return COLORS[id - 4]
	}

	/**
	 *
	 * @param {Number} id
	 * @returns Hexadecimal value of the color corresponding to the minecraft id
	 * @see https://minecraft.gamepedia.com/Map_item_format
	 */
	static hex(id) {
		const { r, g, b } = this.color(id)
		return toHex(r, g, b)
	}

	/**
	 *
	 * @param {Number} hex
	 * @returns an Object { r, g, b } of the color corresponding to the hexadecimal value, or undefined if not found
	 */
	static fromHex(hex) {
		return this.fromRgb(hex >> 16, (hex >> 8) & 0xff, hex & 0xff)
	}

	static fromRgb(r, g, b) {
		for (let color of COLORS) {
			const { r: r2, g: g2, b: b2 } = color
			if (r === r2 && g === g2 && b === b2) return color
		}
	}
}

function toHex(r, g, b) {
	return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff)
}

function cache(...a) {
	const cached = new Map()
	const nearest = a[2].value
	return {
		...a[2],
		value(r, g, b) {
			const hex = toHex(r, g, b)
			let result = cached.get(hex)
			if (result === undefined) {
				result = nearest(r, g, b)
				cached.set(hex, result)
			}
			return result
		},
	}
}

// 1.12
export const COLORS = [
	{ r: 89, g: 125, b: 39 },
	{ r: 109, g: 153, b: 48 },
	{ r: 127, g: 178, b: 56 },
	{ r: 67, g: 94, b: 29 },
	{ r: 174, g: 164, b: 115 },
	{ r: 213, g: 201, b: 140 },
	{ r: 247, g: 233, b: 163 },
	{ r: 130, g: 123, b: 86 },
	{ r: 140, g: 140, b: 140 },
	{ r: 171, g: 171, b: 171 },
	{ r: 199, g: 199, b: 199 },
	{ r: 105, g: 105, b: 105 },
	{ r: 180, g: 0, b: 0 },
	{ r: 220, g: 0, b: 0 },
	{ r: 255, g: 0, b: 0 },
	{ r: 135, g: 0, b: 0 },
	{ r: 112, g: 112, b: 180 },
	{ r: 138, g: 138, b: 220 },
	{ r: 160, g: 160, b: 255 },
	{ r: 84, g: 84, b: 135 },
	{ r: 117, g: 117, b: 117 },
	{ r: 144, g: 144, b: 144 },
	{ r: 167, g: 167, b: 167 },
	{ r: 88, g: 88, b: 88 },
	{ r: 0, g: 87, b: 0 },
	{ r: 0, g: 106, b: 0 },
	{ r: 0, g: 124, b: 0 },
	{ r: 0, g: 65, b: 0 },
	{ r: 180, g: 180, b: 180 },
	{ r: 220, g: 220, b: 220 },
	{ r: 255, g: 255, b: 255 },
	{ r: 135, g: 135, b: 135 },
	{ r: 115, g: 118, b: 129 },
	{ r: 141, g: 144, b: 158 },
	{ r: 164, g: 168, b: 184 },
	{ r: 86, g: 88, b: 97 },
	{ r: 106, g: 76, b: 54 },
	{ r: 130, g: 94, b: 66 },
	{ r: 151, g: 109, b: 77 },
	{ r: 79, g: 57, b: 40 },
	{ r: 79, g: 79, b: 79 },
	{ r: 96, g: 96, b: 96 },
	{ r: 112, g: 112, b: 112 },
	{ r: 59, g: 59, b: 59 },
	{ r: 45, g: 45, b: 180 },
	{ r: 55, g: 55, b: 220 },
	{ r: 64, g: 64, b: 255 },
	{ r: 33, g: 33, b: 135 },
	{ r: 100, g: 84, b: 50 },
	{ r: 123, g: 102, b: 62 },
	{ r: 143, g: 119, b: 72 },
	{ r: 75, g: 63, b: 38 },
	{ r: 180, g: 177, b: 172 },
	{ r: 220, g: 217, b: 211 },
	{ r: 255, g: 252, b: 245 },
	{ r: 135, g: 133, b: 129 },
	{ r: 152, g: 89, b: 36 },
	{ r: 186, g: 109, b: 44 },
	{ r: 216, g: 127, b: 51 },
	{ r: 114, g: 67, b: 27 },
	{ r: 125, g: 53, b: 152 },
	{ r: 153, g: 65, b: 186 },
	{ r: 178, g: 76, b: 216 },
	{ r: 94, g: 40, b: 114 },
	{ r: 72, g: 108, b: 152 },
	{ r: 88, g: 132, b: 186 },
	{ r: 102, g: 153, b: 216 },
	{ r: 54, g: 81, b: 114 },
	{ r: 161, g: 161, b: 36 },
	{ r: 197, g: 197, b: 44 },
	{ r: 229, g: 229, b: 51 },
	{ r: 121, g: 121, b: 27 },
	{ r: 89, g: 144, b: 17 },
	{ r: 109, g: 176, b: 21 },
	{ r: 127, g: 204, b: 25 },
	{ r: 67, g: 108, b: 13 },
	{ r: 170, g: 89, b: 116 },
	{ r: 208, g: 109, b: 142 },
	{ r: 242, g: 127, b: 165 },
	{ r: 128, g: 67, b: 87 },
	{ r: 53, g: 53, b: 53 },
	{ r: 65, g: 65, b: 65 },
	{ r: 76, g: 76, b: 76 },
	{ r: 40, g: 40, b: 40 },
	{ r: 108, g: 108, b: 108 },
	{ r: 132, g: 132, b: 132 },
	{ r: 153, g: 153, b: 153 },
	{ r: 81, g: 81, b: 81 },
	{ r: 53, g: 89, b: 108 },
	{ r: 65, g: 109, b: 132 },
	{ r: 76, g: 127, b: 153 },
	{ r: 40, g: 67, b: 81 },
	{ r: 89, g: 44, b: 125 },
	{ r: 109, g: 54, b: 153 },
	{ r: 127, g: 63, b: 178 },
	{ r: 67, g: 33, b: 94 },
	{ r: 36, g: 53, b: 125 },
	{ r: 44, g: 65, b: 153 },
	{ r: 51, g: 76, b: 178 },
	{ r: 27, g: 40, b: 94 },
	{ r: 72, g: 53, b: 36 },
	{ r: 88, g: 65, b: 44 },
	{ r: 102, g: 76, b: 51 },
	{ r: 54, g: 40, b: 27 },
	{ r: 72, g: 89, b: 36 },
	{ r: 88, g: 109, b: 44 },
	{ r: 102, g: 127, b: 51 },
	{ r: 54, g: 67, b: 27 },
	{ r: 108, g: 36, b: 36 },
	{ r: 132, g: 44, b: 44 },
	{ r: 153, g: 51, b: 51 },
	{ r: 81, g: 27, b: 27 },
	{ r: 17, g: 17, b: 17 },
	{ r: 21, g: 21, b: 21 },
	{ r: 25, g: 25, b: 25 },
	{ r: 13, g: 13, b: 13 },
	{ r: 176, g: 168, b: 54 },
	{ r: 215, g: 205, b: 66 },
	{ r: 250, g: 238, b: 77 },
	{ r: 132, g: 126, b: 40 },
	{ r: 64, g: 154, b: 150 },
	{ r: 79, g: 188, b: 183 },
	{ r: 92, g: 219, b: 213 },
	{ r: 48, g: 115, b: 112 },
	{ r: 52, g: 90, b: 180 },
	{ r: 63, g: 110, b: 220 },
	{ r: 74, g: 128, b: 255 },
	{ r: 39, g: 67, b: 135 },
	{ r: 0, g: 153, b: 40 },
	{ r: 0, g: 187, b: 50 },
	{ r: 0, g: 217, b: 58 },
	{ r: 0, g: 114, b: 30 },
	{ r: 91, g: 60, b: 34 },
	{ r: 111, g: 74, b: 42 },
	{ r: 129, g: 86, b: 49 },
	{ r: 68, g: 45, b: 25 },
	{ r: 79, g: 1, b: 0 },
	{ r: 96, g: 1, b: 0 },
	{ r: 112, g: 2, b: 0 },
	{ r: 59, g: 1, b: 0 },
	{ r: 147, g: 124, b: 113 },
	{ r: 180, g: 152, b: 138 },
	{ r: 209, g: 177, b: 161 },
	{ r: 110, g: 93, b: 85 },
	{ r: 112, g: 57, b: 25 },
	{ r: 137, g: 70, b: 31 },
	{ r: 159, g: 82, b: 36 },
	{ r: 84, g: 43, b: 19 },
	{ r: 105, g: 61, b: 76 },
	{ r: 128, g: 75, b: 93 },
	{ r: 149, g: 87, b: 108 },
	{ r: 78, g: 46, b: 57 },
	{ r: 79, g: 76, b: 97 },
	{ r: 96, g: 93, b: 119 },
	{ r: 112, g: 108, b: 138 },
	{ r: 59, g: 57, b: 73 },
	{ r: 131, g: 93, b: 25 },
	{ r: 160, g: 114, b: 31 },
	{ r: 186, g: 133, b: 36 },
	{ r: 98, g: 70, b: 19 },
	{ r: 72, g: 82, b: 37 },
	{ r: 88, g: 100, b: 45 },
	{ r: 103, g: 117, b: 53 },
	{ r: 54, g: 61, b: 28 },
	{ r: 112, g: 54, b: 55 },
	{ r: 138, g: 66, b: 67 },
	{ r: 160, g: 77, b: 78 },
	{ r: 84, g: 40, b: 41 },
	{ r: 40, g: 28, b: 24 },
	{ r: 49, g: 35, b: 30 },
	{ r: 57, g: 41, b: 35 },
	{ r: 30, g: 21, b: 18 },
	{ r: 95, g: 75, b: 69 },
	{ r: 116, g: 92, b: 84 },
	{ r: 135, g: 107, b: 98 },
	{ r: 71, g: 56, b: 51 },
	{ r: 61, g: 64, b: 64 },
	{ r: 75, g: 79, b: 79 },
	{ r: 87, g: 92, b: 92 },
	{ r: 46, g: 48, b: 48 },
	{ r: 86, g: 51, b: 62 },
	{ r: 105, g: 62, b: 75 },
	{ r: 122, g: 73, b: 88 },
	{ r: 64, g: 38, b: 46 },
	{ r: 53, g: 43, b: 64 },
	{ r: 65, g: 53, b: 79 },
	{ r: 76, g: 62, b: 92 },
	{ r: 40, g: 32, b: 48 },
	{ r: 53, g: 35, b: 24 },
	{ r: 65, g: 43, b: 30 },
	{ r: 76, g: 50, b: 35 },
	{ r: 40, g: 26, b: 18 },
	{ r: 53, g: 57, b: 29 },
	{ r: 65, g: 70, b: 36 },
	{ r: 76, g: 82, b: 42 },
	{ r: 40, g: 43, b: 22 },
	{ r: 100, g: 42, b: 32 },
	{ r: 122, g: 51, b: 39 },
	{ r: 142, g: 60, b: 46 },
	{ r: 75, g: 31, b: 24 },
	{ r: 26, g: 15, b: 11 },
	{ r: 31, g: 18, b: 13 },
	{ r: 37, g: 22, b: 16 },
	{ r: 19, g: 11, b: 8 },
]

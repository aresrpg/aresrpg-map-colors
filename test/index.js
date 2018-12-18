import Colors, { COLORS } from '../src/mapColors'
import tape from 'blue-tape'

tape('Nearest match should return the closest minecraft compatible color', async t => {
	return t.equal(Colors.nearestMatch(89, 125, 39), 4, `${Colors.nearestMatch(89, 125, 39)} should be 4`)
})

// import getPixels from 'get-pixels'
// import { promisify } from 'util'

// const pixels = promisify(getPixels)

// void (async function() {
// 	const img = 'https://i.imgur.com/8IznI89.png'
// 	let index = 0
// 	while (true) {
// 		index++
// 		console.log('Starting benchmark')
// 		// console.log(await Promise.race([run( '1', Colors.fromImage(img)), run( '2', Colors.fromImage2(img)), run( '3', Colors.fromImage3(img))]))
// 		console.log(await run('2', fromImage2(img)))
// 		console.log(await run('1', Colors.fromImage(img))) // <== most performant
// 		console.log(await run('3', fromImage3(img)))
// 	}
// })()

// async function run(name, func) {
// 	const before = Date.now()
// 	for (let i = 0; i < 1000; i++) {
// 		await func
// 	}
// 	const after = Date.now()
// 	return `[${name}] executed in (${after - before}ms)`
// }

// async function fromImage2(path) {
// 	const img = await pixels(path)
// 	const [width, height] = img.shape
// 	const result = new Uint8Array()
// 	let i = 0
// 	for (let x = 0; x < width; x++)
// 		for (let y = 0; y < height; y++) {
// 			result[i++] = nearestMatch2(img.get(x, y, 0), img.get(x, y, 1), img.get(x, y, 2))
// 		}
// 	return result
// }

// async function fromImage3(path) {
// 	const img = await pixels(path)
// 	const [width, height] = img.shape
// 	const result = new Uint8Array()
// 	let i = 0
// 	for (let x = 0; x < width; x++)
// 		for (let y = 0; y < height; y++) {
// 			result[i++] = nearestMatch3(img.get(x, y, 0), img.get(x, y, 1), img.get(x, y, 2))
// 		}
// 	return result
// }

// function nearestMatch2(r1, g1, b1) {
// 	let i = 0xffffffff
// 	let result = 0
// 	for (let [index, { r: r2, g: g2, b: b2 }] of COLORS.entries()) {
// 		const deviation = ((r2 - r1) * 0.3) ** 2 + ((g2 - g1) * 0.59) ** 2 + ((b2 - b1) * 0.11) ** 2
// 		if (deviation < i) {
// 			i = deviation
// 			result = index + 3
// 		}
// 	}
// 	return result
// }

// function nearestMatch3(r1, g1, b1) {
// 	let i = 0xffffffff
// 	let result = 0
// 	let id = 0
// 	for (let { r: r2, g: g2, b: b2 } of COLORS) {
// 		id++
// 		const deviation = ((r2 - r1) * 0.3) ** 2 + ((g2 - g1) * 0.59) ** 2 + ((b2 - b1) * 0.11) ** 2
// 		if (deviation < i) {
// 			i = deviation
// 			result = id + 3
// 		}
// 	}
// 	return result
// }

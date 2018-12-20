import { nearestMatch } from '../src/mapColors'
import tape from 'blue-tape'
import { ComputeColors, ComputeKnown, Framerate } from '../src/minecraftTransform'
import { Readable, PassThrough } from 'stream'

tape('Nearest match should return the closest minecraft compatible color', async t => {
	return t.equal(nearestMatch(89, 125, 39), 4, `${nearestMatch(89, 125, 39)} should be 4`)
})

tape('Framerate should throttle the stream', t => {
	t.plan(1)
	const r = new Readable()
	r._read = () => {}
	const pss = new PassThrough()
	r.pipe(new Framerate(10)).pipe(pss)
	let count = 0
	let pushs = 0
	pss.on('data', () => count++)
	pss.on('finish', () => t.equal(count, 10, `${pushs} were pushed, we should have received 10 and received ${count}`))
	const handle = setInterval(() => {
		pushs++
		r.push('slt')
		if (pushs >= 100) {
			r.push(null)
			clearInterval(handle)
		}
	}, 10)
})

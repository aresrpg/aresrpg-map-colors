import Colors, { COLORS } from '../src/mapColors'
import tape from 'blue-tape'
import { ComputeColors, ComputeKnown, Framerate } from '../src/minecraftTransform'
import { Readable, PassThrough } from 'stream'

tape('Nearest match should return the closest minecraft compatible color', async t => {
	return t.equal(Colors.nearestMatch(89, 125, 39), 4, `${Colors.nearestMatch(89, 125, 39)} should be 4`)
})

tape('Framerate should throttle the stream', t => {
	const r = new Readable()
	const loop = 10
	const fps = 10
	const pss = new PassThrough()
	const last = Date.now()
	for (let i = 0; i < loop; i++) r.push('slt')
	r.push(null)
	r.pipe(new Framerate(fps)).pipe(pss)
	pss.on('data', chunk => {
		if (!chunk) {
			t.ok(Date.now() - last >= 1000, 'The framerate should take at least 1s')
			t.end()
		}
	})
})

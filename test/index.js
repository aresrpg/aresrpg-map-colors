import Colors from '../src/mapColors'

void (async function() {
	console.log(await Colors.fromImage('https://i.imgur.com/28NLJWg.png'))
})()

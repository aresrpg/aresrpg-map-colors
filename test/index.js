import Colors from '../src/mapColors'

void (async function() {
	console.log(await Colors.fromImage('https://i.imgur.com/h8g7SEf.jpg'))
})()

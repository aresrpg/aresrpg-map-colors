import Colors from '../src/mapColors'

void (async function() {
	const d = await Colors.fromImage('https://i.imgur.com/h8g7SEf.jpg')
	d.forEach(l => console.log(l))
})()

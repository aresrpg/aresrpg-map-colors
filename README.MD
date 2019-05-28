![][licence] [![][npm]][npmlink] [![][travis]][travislink] [![][npmdl]][npmlink]

# aresrpg-map-colors

[![][discord]][discordlink] [![][twitter]][twitterlink] ![][mcversion]

[licence]: https://img.shields.io/github/license/AresRPG/aresrpg-map-colors.svg?style=for-the-badge
[npm]: https://img.shields.io/npm/v/@aresrpg/aresrpg-map-colors.svg?logo=npm&style=for-the-badge
[npmlink]: https://www.npmjs.com/package/@aresrpg/aresrpg-map-colors
[travis]: https://img.shields.io/travis/com/AresRPG/aresrpg-map-colors.svg?logo=travis&style=for-the-badge
[travislink]: https://travis-ci.com/AresRPG/aresrpg-map-colors
[npmdl]: https://img.shields.io/npm/dw/@aresrpg/aresrpg-map-colors.svg?color=%239C27B0&style=for-the-badge
[twitter]: https://img.shields.io/badge/follow-us-55acee.svg?logo=twitter&style=for-the-badge
[twitterlink]: https://twitter.com/AresRPG
[discord]: https://img.shields.io/discord/265104803531587584.svg?logo=discord&style=for-the-badge
[discordlink]: https://discord.gg/Ea6a5cn
[mcversion]: https://img.shields.io/badge/minecraft-1.12+-AB47BC.svg?style=for-the-badge

I'm a **performances focused** tool to help you manage minecraft map colors.
I provide utilities to bridge between any colors to minecraft compatible colors

---

## Installation

```sh
npm i @aresrpg/aresrpg-map-colors
```

## Minecraft colors

[![](https://i.imgur.com/Wjsg0KU.png)](https://minecraft.gamepedia.com/Map_item_format#1.12_Color_Table)

---

## Usage

```js
import { nearestMatch, color, hex, fromImage, COLORS } from '@aresrpg/aresrpg-map-colors'
```

Convert an image into an array of minecraft compatible ids

```js
void (async function() {
	const { width, height, datas } = await fromImage('https://i.imgur.com/28NLJWg.png') 
	console.log(datas.length) // imageWidth * imageHeight
	console.log(datas) // [id,id,...] // uInt8
})()
```

#### use it with [@Prismarine/node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol)

Note that you will need to handle image sizes and multiples neighbors map (via item frames) by your own, we only provide conversions

```js
import { fromImage } from '@aresrpg/aresrpg-map-colors'
import mc from 'minecraft-protocol'

void (async function() {
	const size = 128
	const { datas } = await fromImage('https://i.imgur.com/h8g7SEf.jpg')
	this.client.write('map', {
		itemDamage: 0,
		scale: 4,
		trackingPosition: false,
		icons: [],
		columns: -size,
		rows: -size,
		x: 0,
		y: 0,
		data: Buffer.from(data),
	})
})()
```

> In case you want to build an item frame wall with multiple blocks you'll need to handle the buffer to split every 128 values, see [Map item format](https://minecraft.gamepedia.com/Map_item_format)

#### Find the closest color available in minecraft from any color

Arguments and return value are memoized for performances

> We use a weighted aproach of the color space, read more on [Here](https://en.wikipedia.org/wiki/Color_difference)

```js
const colorId = nearestMatch(70, 120, 35)
```

![](https://i.imgur.com/gWAHyQl.png)
![](https://i.imgur.com/ue85juy.png)

#### Find a color by id

same as doing `COLORS[id-4]`

```js
const { r, g, b } = color(4)
```

You can also get the decimal/hexadecimal value

```js
const color = hex(4).toString(16)
```

![][licence] [![][npm]][npmlink] [![][travis]][travislink] [![][depfu]][depfulink]

# aresrpg-map-colors

[![][discord]][discordlink] [![][twitter]][twitterlink]

[licence]: https://img.shields.io/github/license/AresRPG/aresrpg-map-colors.svg?style=for-the-badge
[npm]: https://img.shields.io/npm/v/@aresrpg/aresrpg-map-colors.svg?logo=npm&style=for-the-badge
[npmlink]: https://www.npmjs.com/package/@aresrpg/aresrpg-map-colors
[travis]: https://img.shields.io/travis/com/AresRPG/aresrpg-map-colors.svg?logo=travis&style=for-the-badge
[travislink]: https://travis-ci.com/AresRPG/aresrpg-map-colors
[depfu]: https://img.shields.io/depfu/AresRPG/aresrpg-map-colors.svg?style=for-the-badge
[depfulink]: https://depfu.com/repos/AresRPG/aresrpg-map-colors
[twitter]: https://img.shields.io/badge/follow-us-blue.svg?logo=twitter&style=for-the-badge
[twitterlink]: https://twitter.com/AresRPG
[discord]: https://img.shields.io/discord/265104803531587584.svg?logo=discord&style=for-the-badge
[discordlink]: https://discord.gg/Ea6a5cn

Minecraft item map colors utility.
---
## Install

`npm i @aresrpg/aresrpg-map-colors`

[![](https://i.imgur.com/Wjsg0KU.png)](https://minecraft.gamepedia.com/Map_item_format#1.12_Color_Table)
---
## Use:

```js
import MapColor, { COLORS } from '@aresrpg/aresrpg-map-colors'
```

### Convert an image into an array of minecraft compatible ids

```js
const datas = await MapColor.fromImage('https://i.imgur.com/28NLJWg.png')
```

#### Exemple of use with [@Prismarine/node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol)

Note that you will need to handle image sizes and multiples neighbors map (via item frames) by your own, we only provide conversions

```js
import MapColor, { COLORS } from '@aresrpg/aresrpg-map-colors'
import mc from 'minecraft-protocol'

void async function() {
	const datas = await MapColor.fromImage('https://i.imgur.com/28NLJWg.png')
	const buffer = []

	for (let x = 0; x < 128; x++)
		for (let y = 0; y < 128; y++) {
			const { id } = datas[x + y]
			buffer.push(id)
		}

	client.write('map', {
		itemDamage: 0,
		scale: 4,
		trackingPosition: false,
		icons: [],
		columns: -128,
		rows: -128,
		x: 0,
		y: 0,
		data: Buffer.from(buffer),
	})
}()

```

> Servers should build their own system with the `nearestMatch` function right below to be able to only send updated pixels and not the whole image every time! see [Map item format](https://minecraft.gamepedia.com/Map_item_format)

### Find the closest color available in minecraft from any color

Arguments and return value are memoized for performances

> We use a weighted aproach of the color space, read more on [Here](https://en.wikipedia.org/wiki/Color_difference)

```js
const color = MapColor.nearestMatch(70, 120, 35)
// color = { id: 1, r: 89, g: 125, b: 39 }
```

![](https://i.imgur.com/gWAHyQl.png)
![](https://i.imgur.com/ue85juy.png)

### Find a color by id

> same as doing `COLORS[id-4]`

```js
const { r, g, b } = MapColor.color(4)
```

You can also get the decimal/hexadecimal value

```js
const color = MapColor.hex(4).toString(16)
```

### Find a color by value

```js
const { r, g, b } = MapColor.fromHex(0x597d27)
```

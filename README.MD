# aresrpg-world

Minecraft item map colors utility.

### Install

`npm i @aresrpg/aresrpg-map-colors`

![https://minecraft.gamepedia.com/Map_item_format#1.12_Color_Table](https://i.imgur.com/Wjsg0KU.png)

### Use:

```js
import MapColor, { COLORS } from '@aresrpg/aresrpg-map-colors'
```

### Find the closest color available in minecraft from any color

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
const color = MapColor.color(4)
```

You can also get the decimal/hexadecimal value

```js
const color = MapColor.hex(4).toString(16)
```

### Find a color by value

```js
const color = MapColor.fromHex(0x597d27)
color = MapColor.fromRgb(89, 125, 39)
```

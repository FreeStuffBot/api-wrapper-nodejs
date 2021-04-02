# FreeStuff API Wrapper

This is the official NodeJS API wrapper for the FreeStuff API. For more information see https://docs.freestuffbot.xyz/

## Docs

> This api wrapper has typescript typings included. Your editor should show smart tooltips and autocomplete even if you are using vanialla javascript.

First, import the api using
```js
import { FreeStuffApi } from "freestuff"
// or
const FreeStuffApi = require('freestuff')
```

Then you're ready to create a new connection to the api
```js
const fsapi = new FreeStuffApi({
  key: 'key here'
})
```

The object passed to the api in the example above can take more parameters, all of which are optionally:
```js
const fsapi = new FreeStuffApi({
  key: 'key here', // plain key without "Basic" or other prefixes
  baseUrl: 'https://url.to.api/', // only used for debugging
  websocketSecret: '', // websocket secret that gets matched if you're using the inbuilt express.js middleware
  cacheTtl: { // cache duration for the specific endpoints in ms
    gameList: 1000,
    gameDetails: 1000
  }
})
```

To get all current free games use
```js
const games = await fsapi.getGameList('free')
// games = [ 1234, 12345 ]
```

This method will only return the game ids. To get information about the games with those ids you'll need to run the following method:

```js
const games = [ 1234, 12345 ]
const info = await fsapi.getGameDetails(games, 'info')
```

Alternatively you can also request locaized versions of the info by appending a language object:

```js
const info = await fsapi.getGameDetails(games, 'info', {
  language: [
    'en-US',
    'de-DE',
    'pl'
  ]
})
```

The returned game info objects look like this:

```js
GameInfo: {
  id: number
  url: string
  org_url: string
  title: string
  org_price: {
    euro: number
    dollar: number
  }
  price: {
    euro: number
    dollar: number
  }
  thumbnail: {
    org: string
    blank: string
    full: string
    tags: string
  }
  kind: ProductKind
  tags: string[]
  description: string
  rating?: number
  notice?: string
  until: Date
  store: Store
  flags: GameFlags
  type: AnnouncementType
  store_meta: {
    steam_subids: string
  },
  localized?: {
    'en-US': LocalizedGameInfo
    [key: string]: LocalizedGameInfo
  }
}

LocalizedGameInfo: {
  lang_name: string,
  lang_name_en: string,
  lang_flag_emoji: string,
  platform: string,
  claim_long: string,
  claim_short: string,
  free: string,
  header: string,
  footer: string,
  org_price_eur: string,
  org_price_usd: string,
  until: string,
  until_alt: string,
  flags: string[]
}
```

For more info about the Object types see https://docs.freestuffbot.xyz/v1/types#gameinfo



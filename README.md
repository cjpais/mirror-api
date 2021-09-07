# mirror-api

A public API into https://mirror.xyz. Primarily being used for generating RSS feeds on top of Mirror. Built on top of the raw data from [arweave](https://www.arweave.org) where mirror is hosting data. Using Next.js and [Prisma](https://www.prisma.io) under the hood.

Live Site - https://mirror.cjpais.com

## Installation

1. `git clone `
2. `yarn install`
3. `yarn dev`
4. Visit https://localhost:3000

## API

### /api/rss - [Demo](https://mirror.cjpais.com/api/rss)

Generates an RSS feed for the latest posts from the entire Mirror site

### Publishers (Publications)

**Publisher Type:**

```
{
  id: number;       // id of publication
  name: string;     // name of publication
  link: string;     // link to publication (<name>.mirror.xyz)
  createdAt: Date;  // when this publication was first created
}
```

#### `/api/publishers` - [Demo](https://mirror.cjpais.com/api/publishers)

Returns a list of Publishers as defined above

#### `/api/publisher/<name>` - [Demo](https://mirror.cjpais.com/api/publisher/g)

Returns a list of all the posts from a publisher. Where `name` is the name of the publisher on Mirror. This is the subdomain on the Mirror website (ex: g.mirror.xyz => `name = g`)

#### `/api/publisher/<name>/rss` - [Demo](https://mirror.cjpais.com/api/publisher/g/rss)

Returns an RSS feed for this publisher. Where `name` is the name of the publisher on Mirror.

### Posts

#### `/api/posts/latest/` - [Demo](https://mirror.cjpais.com/api/posts/latest)

Returns the latest 10 posts from Mirror.

#### `/api/posts/latest/<number>` - [Demo](https://mirror.cjpais.com/api/posts/latest/30)

Returns the latest `number` posts from Mirror.

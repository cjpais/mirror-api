# mirror-api

A public API into https://mirror.xyz. Primarily being used for generating RSS feeds on top of Mirror. Built on top of the raw data from [arweave](https://www.arweave.org) where mirror is hosting data. Using [Next.js](https://nextjs.org) and [Prisma](https://www.prisma.io) under the hood.

Live Site - https://mirror.cjpais.com

NOTE: It looks like everything is broken at the moment, however there should be some good info here regardless, just don't expect the endpoints to behave. When I get a chance I will be updating it

## Installation

1. `git clone git@github.com:cjpais/mirror-api.git`
2. `yarn install`
3. `yarn dev`
4. Visit https://localhost:3000

## API

### `/api/rss` - [Demo](https://mirror.cjpais.com/api/rss)

Generates an RSS feed for the latest posts from the entire Mirror site. Plug this into your RSS reader :)

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

**Post Type:**

```
{
  id: number;                       // id of this post
  title: string;                    // title of this post
  content: string;                  // raw content of the post (taken from arweave)
  createdAt: Date;                  // when this post was created in the DB
  publishedAt: Date;                // when this post was published on arweave
  digest: string;                   // the digest of this post from arweave
  link: string;                     // the link to this post (on mirror.xyz)
  originalDigest: string | null;    // the original digest of this post
  publicationName: string;          // the name of the publisher who published this post
  cursor: string;                   // the cursor where this entry is in the arweave query
  arweaveTx: string;                // the transaction on arweave to directly look the post up (arweave.net/arweaveTx)
}
```

#### `/api/posts/latest/` - [Demo](https://mirror.cjpais.com/api/posts/latest)

Returns the latest 10 posts from Mirror.

#### `/api/posts/latest/<number>` - [Demo](https://mirror.cjpais.com/api/posts/latest/30)

Returns the latest `number` posts from Mirror.

## Bonus

If you are interested in how the DB is built, it all comes from arweave. This query will do
the trick ;)

https://arweave.net/graphql

```
query PaginatedTransactions($cursor: String) {
  transactions(
    tags: { name: "App-Name", values: ["MirrorXYZ"] }
    first: 100
    sort: HEIGHT_DESC
    after: $cursor
  ) {
    edges {
      cursor
      node {
        id
        block {
          height
        }
      }
    }
  }
}
```

# ⛓ next-proper

[![npm](https://img.shields.io/npm/v/next-proper?style=flat-square)](https://www.pkgstats.com/pkg:next-proper)
[![NPM](https://img.shields.io/npm/l/next-proper?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/next-proper?style=flat-square)](https://www.pkgstats.com/pkg:next-proper)

Easily compile NextJS props via composed methods for `getServerSideProps` and `getStaticProps`.

## Install

Via [npm](https://npmjs.com/package/next-proper)

```
npm install --save next-proper
```

Via [Yarn](https://yarn.fyi/next-proper)

```
yarn add next-proper
```

## How to use

The goal of this package is to make it easy to compose NextJS props logic for either `getServerSideProps` or `getStaticProps`, so that you don’t have to copy that same code through all your pages.

Depending on your needs, or your apps logic, as you compose your prop methods, you can internally either exit early with `{ notFound: true }` or `{ redirect: ... }`, or continue the chain by calling, `next({ props: {...} })`;

Here’s a basic example using some simplified auth logic:

_`props/getServerSideAuthProps.js`_

```
export const getServerSideAuthProps = async (props, next, ctx) => {
  ...Do auth stuff...
  const user = getUser(...)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return next({
    props: {
      user,
    }
  })
}
```

_`pages/secure-page.js`_

```
import nextProps from 'next-proper'
import { getServerSideAuthProps } from 'props/getServerSideAuthProps'
import { getServerSideFetchPageProps } from 'props/getServerSideFetchPageProps'

export const getServerSideProps = (ctx) => nextProps([
  getServerSideAuthProps,
  getServerSideFetchPageProps,
])(ctx)
```

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)

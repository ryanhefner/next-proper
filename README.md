# ⛓ next-proper

[![npm](https://img.shields.io/npm/v/next-proper?style=flat-square)](https://www.pkgstats.com/pkg:next-proper)
[![NPM](https://img.shields.io/npm/l/next-proper?style=flat-square)](LICENSE)
[![npm](https://img.shields.io/npm/dt/next-proper?style=flat-square)](https://www.pkgstats.com/pkg:next-proper)
[![Coveralls github](https://img.shields.io/coveralls/github/ryanhefner/next-proper?style=flat-square)](https://coveralls.io/github/ryanhefner/next-proper)
[![codecov](https://codecov.io/gh/ryanhefner/next-proper/branch/main/graph/badge.svg)](https://codecov.io/gh/ryanhefner/next-proper)
[![CircleCI](https://img.shields.io/circleci/build/github/ryanhefner/next-proper?style=flat-square)](https://circleci.com/gh/ryanhefner/next-proper)
![Known Vulnerabilities](https://snyk.io/test/github/ryanhefner/next-proper/badge.svg)
![Twitter Follow](https://img.shields.io/twitter/follow/ryanhefner)

Compose reusable prop handlers for Next.js `getServerSideProps` and `getStaticProps` to eliminate code duplication across pages.

## Why next-proper?

Instead of copying the same authentication, data fetching, and validation logic across every page, `next-proper` lets you compose reusable handlers that can be shared across your Next.js application. This makes your code more maintainable, testable, and DRY.

## Features

- 🎯 **Composable handlers** - Chain multiple handlers together
- 🔄 **Control flow handlers** - Built-in handlers for parallel execution, conditional logic, and fallback strategies
- 🛡️ **Type-safe** - Full TypeScript support
- 📦 **Tree-shakeable** - Import only what you need
- ⚡ **Zero dependencies** - Lightweight and fast
- 🔌 **Flexible** - Works with both `getServerSideProps` and `getStaticProps`

## Install

```bash
npm install next-proper
```

or

```bash
yarn add next-proper
```

## Quick Start

### Basic Usage

Create reusable handlers and compose them:

```javascript
// lib/props/getAuthProps.js
export const getAuthProps = async (props, next, ctx) => {
  const user = await getUserFromSession(ctx.req)

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return next({
    ...props,
    props: {
      ...props.props,
      user,
    },
  })
}

// lib/props/getPageData.js
export const getPageData = async (props, next, ctx) => {
  const data = await fetchPageData(ctx.params.id)

  return next({
    ...props,
    props: {
      ...props.props,
      data,
    },
  })
}

// pages/secure-page.js
import nextProps from 'next-proper'
import { getAuthProps } from '../lib/props/getAuthProps'
import { getPageData } from '../lib/props/getPageData'

export const getServerSideProps = nextProps([getAuthProps, getPageData])
```

### Handler Pattern

Handlers receive three arguments:

- `props` - Current props object (accumulated from previous handlers)
- `next` - Function to continue the chain with updated props
- `...args` - Additional arguments passed to `getServerSideProps`/`getStaticProps` (e.g., `context`)

Handlers can:

- **Continue the chain**: Call `next({ ...props, props: { ...props.props, newData } })`
- **Exit early**: Return `{ redirect: {...} }` or `{ notFound: true }`
- **Short-circuit**: Return a value without calling `next()` to stop the chain

## Control Flow Handlers

### Parallel Execution

Run multiple handlers concurrently and merge their results:

```javascript
import nextProps from 'next-proper'
import { parallel } from 'next-proper/handlers'
import { getUserData } from '../lib/props/getUserData'
import { getPageData } from '../lib/props/getPageData'
import { getAnalytics } from '../lib/props/getAnalytics'

export const getServerSideProps = nextProps([
  getAuthProps,
  parallel([getUserData, getPageData, getAnalytics]),
])
```

### Conditional Handlers

Run handlers conditionally based on a predicate:

```javascript
import nextProps from 'next-proper'
import { conditional } from 'next-proper/handlers'
import { getAdminData } from '../lib/props/getAdminData'

const isAdmin = (props) => props?.props?.user?.role === 'admin'

export const getServerSideProps = nextProps([
  getAuthProps,
  conditional(isAdmin, getAdminData),
  getPageData,
])
```

### Fallback Strategy

Try handlers sequentially until one succeeds:

```javascript
import nextProps from 'next-proper'
import { fallback } from 'next-proper/handlers'
import { getDataFromAPI } from '../lib/props/getDataFromAPI'
import { getDataFromCache } from '../lib/props/getDataFromCache'

export const getServerSideProps = nextProps([
  getAuthProps,
  fallback(
    [getDataFromAPI, getDataFromCache],
    { props: { data: [] } }, // Default value if all fail
  ),
])
```

## Advanced Examples

### Combining Multiple Handlers

```javascript
import nextProps from 'next-proper'
import { parallel, conditional, fallback } from 'next-proper/handlers'

export const getServerSideProps = nextProps([
  // Always run auth first
  getAuthProps,

  // Run these in parallel
  parallel([getUserProfile, getNotifications]),

  // Conditionally load admin data
  conditional((props) => props?.props?.user?.isAdmin, getAdminDashboard),

  // Try primary API, fallback to cache
  fallback([getDataFromPrimaryAPI, getDataFromCache], {
    props: { data: null },
  }),
])
```

### Custom Initial Props

```javascript
export const getServerSideProps = nextProps([getAuthProps, getPageData], {
  initialProps: {
    props: {
      initialValue: 'default',
    },
  },
})
```

## API Reference

### `nextProps(handlers, options?)`

Main function to compose handlers.

**Parameters:**

- `handlers` - Array of handler functions
- `options` - Optional configuration
  - `options.initialProps` - Initial props object (default: `{ props: {} }`)

**Returns:** A function compatible with `getServerSideProps` or `getStaticProps`

### Handlers

#### `parallel(handlers)`

Run handlers in parallel and merge results.

```javascript
import { parallel } from 'next-proper/handlers'
```

#### `conditional(condition, handlers)`

Run handlers if condition is true.

```javascript
import { conditional } from 'next-proper/handlers'
```

**Parameters:**

- `condition` - Function `(props, ...args) => boolean`, boolean, or Promise
- `handlers` - Single handler or array of handlers

#### `fallback(handlers, defaultValue?)`

Try handlers sequentially until one succeeds.

```javascript
import { fallback } from 'next-proper/handlers'
```

**Parameters:**

- `handlers` - Array of handlers to try
- `defaultValue` - Optional default value if all handlers fail (can be function, promise, or value)

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import nextProps from 'next-proper'
import { parallel, conditional, fallback } from 'next-proper/handlers'
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE) © [Ryan Hefner](https://www.ryanhefner.com)

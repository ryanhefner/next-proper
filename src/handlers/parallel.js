/**
 * parallel - Run multiple handlers in parallel and merge their results.
 *
 * @typedef {Object} HandlerProps
 * @property {Record<string, any>} [props] - Props object for Next.js
 * @property {*} [key] - Additional metadata properties
 *
 * @typedef {(props: HandlerProps) => Promise<HandlerResult>} NextFunction
 *
 * @typedef {Object|{props: Record<string, any>}|{redirect: {destination: string, permanent: boolean}}|{notFound: true}|{revalidate?: number|boolean}} HandlerResult
 *
 * @typedef {(props: HandlerProps, next: NextFunction, ...args: any[]) => Promise<HandlerResult>} Handler
 *
 * @param {Handler[]} handlers - Array of handlers to run in parallel
 * @returns {Handler} Handler function
 */
export const parallel = (handlers) => {
  return async (props, next, ...args) => {
    const results = await Promise.all(
      handlers.map((handler) => handler(props, next, ...args)),
    )
    return results.reduce((acc, result) => {
      const merged = { ...acc, ...result }
      if (acc.props || result.props) {
        merged.props = { ...(acc.props || {}), ...(result.props || {}) }
      }
      return merged
    }, {})
  }
}

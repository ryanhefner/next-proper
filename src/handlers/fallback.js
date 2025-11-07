/**
 * fallback - Run handlers sequentially until one succeeds (doesn't throw).
 * If a handler throws an error, the next handler is tried.
 * If all handlers fail and a default value is provided, it is returned.
 * Otherwise, the last error is thrown.
 *
 * @typedef {Object} HandlerProps
 * @property {Record<string, any>} [props] - Props object for Next.js
 * @property {*} [key] - Additional metadata properties
 *
 * @typedef {(props: HandlerProps) => Promise<HandlerResult>} NextFunction
 *
 * @typedef {Object} Redirect
 * @property {string} destination - Redirect destination URL
 * @property {boolean} [permanent] - Whether the redirect is permanent
 * @property {number} [statusCode] - HTTP status code for redirect (getServerSideProps only)
 *
 * @typedef {{props: Record<string, any>}|{redirect: Redirect}|{notFound: true}} GetServerSidePropsResult
 *
 * @typedef {{props: Record<string, any>}|{redirect: Redirect}|{notFound: true}|{revalidate?: number|boolean}} GetStaticPropsResult
 *
 * @typedef {GetServerSidePropsResult|GetStaticPropsResult|HandlerProps} HandlerResult
 *
 * @typedef {(props: HandlerProps, next: NextFunction, ...args: any[]) => Promise<HandlerResult>} Handler
 *
 * @param {Handler[]} handlers - Array of handlers to try in sequence
 * @param {(props: HandlerProps, ...args: any[]) => HandlerResult|Promise<HandlerResult>|HandlerResult|Promise<HandlerResult>} [defaultValue] - Optional default value to return if all handlers fail.
 *   Can be a function that receives (props, ...args), a promise, or any value.
 * @returns {Handler} Handler function
 */
export const fallback = (handlers, defaultValue) => {
  return async (props, next, ...args) => {
    const handlersArray = Array.isArray(handlers) ? handlers : [handlers]

    if (handlersArray.length === 0) {
      return await next(props)
    }

    let lastError = null

    // Try each handler until one succeeds
    for (let i = 0; i < handlersArray.length; i++) {
      const handler = handlersArray[i]

      try {
        // Create a next function that continues with the original chain
        // When a handler calls next(), it should continue normally, not try the next fallback
        const continueChain = async (currentProps) => {
          return await next(currentProps)
        }

        // Try to execute the handler
        const result = await handler(props, continueChain, ...args)
        // If we get here, the handler succeeded (didn't throw)
        return result
      } catch (error) {
        // Handler failed, save the error and try the next one
        lastError = error
        continue
      }
    }

    // All handlers failed
    if (lastError) {
      // If a default value is provided, return it instead of throwing
      if (defaultValue !== undefined) {
        let defaultResult
        if (typeof defaultValue === 'function') {
          defaultResult = await defaultValue(props, ...args)
        } else {
          defaultResult = await Promise.resolve(defaultValue)
        }
        return defaultResult
      }
      // No default value, throw the last error
      throw lastError
    }

    // No handlers succeeded and no errors (shouldn't happen, but handle it)
    return await next(props)
  }
}

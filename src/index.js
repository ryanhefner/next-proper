/**
 * nextProps - Compose props providers for `getServerSideProps` and `getStaticProps` NextJS methods.
 *
 * @typedef {Object} HandlerProps
 * @property {Record<string, any>} [props] - Props object for Next.js
 * @property {*} [key] - Additional metadata properties
 *
 * @typedef {Object} NextPropsOptions
 * @property {HandlerProps} [initialProps] - Initial props object (default: `{ props: {} }`)
 *
 * @typedef {(props: HandlerProps, next: (props: HandlerProps) => Promise<HandlerResult>, ...args: any[]) => Promise<HandlerResult>} Handler
 *
 * @typedef {Object|{props: Record<string, any>}|{redirect: {destination: string, permanent: boolean}}|{notFound: true}|{revalidate?: number|boolean}} HandlerResult
 *
 * @param {Handler[]} handlers - Array of handler functions
 * @param {NextPropsOptions} [options] - Optional configuration
 * @returns {(...args: any[]) => Promise<HandlerResult>} A function compatible with `getServerSideProps` or `getStaticProps`
 */
const nextProps =
  (handlers, options) =>
  async (...args) => {
    let handlerIndex = -1

    const defaultHandler = async (props) => props

    const nextHandler = () => handlers[++handlerIndex] || defaultHandler

    const callHandler = (handler) => async (props) =>
      await handler(props, callHandler(nextHandler()), ...args)

    const { initialProps } = Object.assign(
      {},
      { initialProps: { props: {} } },
      options,
    )

    return await callHandler(nextHandler())(initialProps)
  }

export default nextProps

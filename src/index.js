/**
 * nextProps - Compose props providers for `getServerSideProps` and `getStaticProps` NextJS methods.
 *
 * @param {Function[]} handlers
 * @param {Object=} options
 * @param {Object=} options.initialProps
 * @return {(...args: any[]) => Promise<any>}
 */
const nextProps = (handlers, options) => async (...args) => {
  let handlerIndex = -1

  const defaultHandler = async (props) => props

  const nextHandler = () => handlers[++handlerIndex] || defaultHandler

  const callHandler = handler => async (props) =>
    await handler(props, callHandler(nextHandler()), ...args)

  const { initialProps } = Object.assign({}, { initialProps: {} }, options)

  return await callHandler(nextHandler())(initialProps)
}

export default nextProps

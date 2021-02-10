/**
 * nextProps - Compose props providers for `getServerSideProps` and `getStaticProps` NextJS methods.
 *
 * @param {Object=} config
 * @param {Object=} config.initialProps
 * @return {(handlers: ((props: any, next: (((props: any) => Promise<GetServerSidePropsResult<any> | any>), ...args: any[]) => Promise<GetServerSidePropsResults<any> | any>}
 */
const nextProps = (config) => handlers => async (...args) => {
  let handlerIndex = -1

  const defaultHandler = async (props) => props

  const nextHandler = () => handlers[++handlerIndex] || defaultHandler

  const callHandler = handler => async (props) =>
    await handler(props, callHandler(nextHandler()), ...args)

  const { initialProps } = Object.assign({}, { initialProps: {} }, config)

  return await callHandler(nextHandler())(initialProps)
}

export default nextProps

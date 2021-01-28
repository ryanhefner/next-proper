/**
 * @param {{ initialProps: any }}
 * @return {(handlers: ((props: any, next: (((props: any) => Promise<GetServerSidePropsResult<{ props: any } | { notFound: boolean } | { redirect: Redirect }>>), ...args: any[]) => Promise<GetServerSidePropsResults<{ props: any } | { notFound: boolean } | { redirect: Redirect }>)[]) => (...args: any[]) => Promise<GetServerSidePropsResult<{ props: any } | { notFound: boolean } | { redirect: Redirect }>>}
 */
const nextProps = ({ initialProps = {} }) => handlers => async (...args) => {
  let handlerIndex = -1

  const nextHandler = () => {
    handlerIndex++
    return handlers[handlerIndex] || ((props) => props)
  }

  const callHandler = handler => props => {
    return handler(props, callHandler(nextHandler()), ...args)
  }

  return callHandler(nextHandler())(initialProps)
}

export default nextProps

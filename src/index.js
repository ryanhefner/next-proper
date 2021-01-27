const nextProps = ({ initialProps = {} }) => handlers => async (...args) => {
  let handlerIndex = -1

  const nextHandler = () => {
    handlerIndex++
    return handlers[handlerIndex] || null
  }

  const callHandler = handler => props => {
    return handler(props, callHandler(nextHandler()), ...args)
  }

  return callHandler(nextHandler(), ...args)(initialProps)
}

export default nextProps

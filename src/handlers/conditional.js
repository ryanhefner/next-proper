/**
 * conditional - Run handlers conditionally based on a predicate function.
 *
 * @param {Function|Promise<boolean>|boolean} condition - Function that receives (props, ...args) and returns boolean, or a boolean/promise
 * @param {Function|Function[]} handlers - Single handler or array of handlers to run if condition is true
 * @return {Function} Handler function
 */
export const conditional = (condition, handlers) => {
  return async (props, next, ...args) => {
    // Evaluate condition - can be a function, promise, or boolean
    let conditionResult
    if (typeof condition === 'function') {
      conditionResult = await condition(props, ...args)
    } else {
      conditionResult = await Promise.resolve(condition)
    }

    // If condition is false, skip handlers and continue chain
    if (!conditionResult) {
      return await next(props)
    }

    // If condition is true, run handlers
    const handlersArray = Array.isArray(handlers) ? handlers : [handlers]

    if (handlersArray.length === 0) {
      return await next(props)
    }

    // Run handlers sequentially (each can call next)
    let currentIndex = -1
    const defaultHandler = async (p) => p
    const getNextHandler = () => handlersArray[++currentIndex] || defaultHandler

    const runHandler = async (currentProps) => {
      const handler = getNextHandler()
      if (handler === defaultHandler) {
        return await next(currentProps)
      }
      return await handler(
        currentProps,
        (newProps) => runHandler(newProps || currentProps),
        ...args,
      )
    }

    return await runHandler(props)
  }
}

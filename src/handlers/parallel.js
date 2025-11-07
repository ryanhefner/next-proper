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

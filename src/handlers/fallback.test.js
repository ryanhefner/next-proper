import { describe, it, expect, vi } from 'vitest'
import { fallback } from './fallback'

describe('fallback', () => {
  it('should return result from first successful handler', async () => {
    const handler1 = vi.fn(async (props, next) => {
      return await next({ ...props, a: 1 })
    })
    const handler2 = vi.fn(async (props, next) => {
      return await next({ ...props, b: 2 })
    })

    const fallbackHandler = fallback([handler1, handler2])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await fallbackHandler(props, next)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {}, a: 1 })
  })

  it('should try next handler if first one throws', async () => {
    const handler1 = vi.fn(async () => {
      throw new Error('Handler 1 failed')
    })
    const handler2 = vi.fn(async (props, next) => {
      return await next({ ...props, b: 2 })
    })

    const fallbackHandler = fallback([handler1, handler2])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await fallbackHandler(props, next)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: {}, b: 2 })
  })

  it('should try all handlers until one succeeds', async () => {
    const handler1 = vi.fn(async () => {
      throw new Error('Handler 1 failed')
    })
    const handler2 = vi.fn(async () => {
      throw new Error('Handler 2 failed')
    })
    const handler3 = vi.fn(async (props, next) => {
      return await next({ ...props, c: 3 })
    })

    const fallbackHandler = fallback([handler1, handler2, handler3])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await fallbackHandler(props, next)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
    expect(handler3).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: {}, c: 3 })
  })

  it('should throw last error if all handlers fail', async () => {
    const error1 = new Error('Handler 1 failed')
    const error2 = new Error('Handler 2 failed')
    const error3 = new Error('Handler 3 failed')

    const handler1 = vi.fn(async () => {
      throw error1
    })
    const handler2 = vi.fn(async () => {
      throw error2
    })
    const handler3 = vi.fn(async () => {
      throw error3
    })

    const fallbackHandler = fallback([handler1, handler2, handler3])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    await expect(fallbackHandler(props, next)).rejects.toThrow(
      'Handler 3 failed',
    )

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
    expect(handler3).toHaveBeenCalledTimes(1)
  })

  it('should pass props, next, and additional args to handlers', async () => {
    const handler1 = vi.fn(async () => {
      throw new Error('Handler 1 failed')
    })
    const handler2 = vi.fn(async (props, next, arg1, arg2) => {
      return await next({ ...props, arg1, arg2 })
    })

    const fallbackHandler = fallback([handler1, handler2])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)
    const arg1 = 'test1'
    const arg2 = 'test2'

    const result = await fallbackHandler(props, next, arg1, arg2)

    expect(handler1).toHaveBeenCalledWith(
      props,
      expect.any(Function),
      arg1,
      arg2,
    )
    expect(handler2).toHaveBeenCalledWith(
      props,
      expect.any(Function),
      arg1,
      arg2,
    )
    expect(result).toEqual({ props: {}, arg1: 'test1', arg2: 'test2' })
  })

  it('should handle empty handlers array', async () => {
    const fallbackHandler = fallback([])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await fallbackHandler(props, next)

    expect(next).toHaveBeenCalledWith(props)
    expect(result).toEqual({ props: {} })
  })

  it('should handle single handler', async () => {
    const handler = vi.fn(async (props, next) => {
      return await next({ ...props, a: 1 })
    })

    const fallbackHandler = fallback(handler)
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await fallbackHandler(props, next)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: {}, a: 1 })
  })

  it('should allow handlers to call next to continue chain', async () => {
    const handler1 = vi.fn(async (props, next) => {
      const result = await next(props)
      return { ...result, a: 1 }
    })
    const handler2 = vi.fn(async (props, next) => {
      return await next({ ...props, b: 2 })
    })

    const fallbackHandler = fallback([handler1, handler2])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await fallbackHandler(props, next)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {}, a: 1 })
  })

  it('should handle async errors', async () => {
    const handler1 = vi.fn(async () => {
      await Promise.resolve()
      throw new Error('Async error')
    })
    const handler2 = vi.fn(async (props, next) => {
      return await next({ ...props, success: true })
    })

    const fallbackHandler = fallback([handler1, handler2])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await fallbackHandler(props, next)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: {}, success: true })
  })

  it('should merge props correctly from successful handler', async () => {
    const handler1 = vi.fn(async () => {
      throw new Error('Handler 1 failed')
    })
    const handler2 = vi.fn(async (props, next) => {
      const result = await next(props)
      return {
        ...result,
        props: {
          ...(result.props || {}),
          added: true,
        },
      }
    })

    const fallbackHandler = fallback([handler1, handler2])
    const props = { props: { existing: 'value' } }
    const next = vi.fn(async (p) => p)

    const result = await fallbackHandler(props, next)

    expect(result).toEqual({
      props: {
        existing: 'value',
        added: true,
      },
    })
  })

  it('should handle handlers that short-circuit without calling next', async () => {
    const handler1 = vi.fn(async () => {
      throw new Error('Handler 1 failed')
    })
    const handler2 = vi.fn(async () => {
      return { shortCircuit: true, props: { a: 1 } }
    })

    const fallbackHandler = fallback([handler1, handler2])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await fallbackHandler(props, next)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
    expect(next).not.toHaveBeenCalled()
    expect(result).toEqual({ shortCircuit: true, props: { a: 1 } })
  })

  describe('with default value', () => {
    it('should return default value when all handlers fail', async () => {
      const handler1 = vi.fn(async () => {
        throw new Error('Handler 1 failed')
      })
      const handler2 = vi.fn(async () => {
        throw new Error('Handler 2 failed')
      })

      const defaultValue = { props: { default: true } }
      const fallbackHandler = fallback([handler1, handler2], defaultValue)
      const props = { props: {} }
      const next = vi.fn(async (p) => p)

      const result = await fallbackHandler(props, next)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ props: { default: true } })
    })

    it('should return default value from function when all handlers fail', async () => {
      const handler1 = vi.fn(async () => {
        throw new Error('Handler 1 failed')
      })

      const defaultValue = vi.fn(async (props, arg1) => {
        return { props: { default: true, arg1 } }
      })

      const fallbackHandler = fallback([handler1], defaultValue)
      const props = { props: {} }
      const next = vi.fn(async (p) => p)
      const arg1 = 'test'

      const result = await fallbackHandler(props, next, arg1)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(defaultValue).toHaveBeenCalledWith(props, arg1)
      expect(result).toEqual({ props: { default: true, arg1: 'test' } })
    })

    it('should return default value from promise when all handlers fail', async () => {
      const handler1 = vi.fn(async () => {
        throw new Error('Handler 1 failed')
      })

      const defaultValue = Promise.resolve({ props: { default: true } })
      const fallbackHandler = fallback([handler1], defaultValue)
      const props = { props: {} }
      const next = vi.fn(async (p) => p)

      const result = await fallbackHandler(props, next)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ props: { default: true } })
    })

    it('should still throw error when no default value is provided', async () => {
      const handler1 = vi.fn(async () => {
        throw new Error('Handler 1 failed')
      })
      const handler2 = vi.fn(async () => {
        throw new Error('Handler 2 failed')
      })

      const fallbackHandler = fallback([handler1, handler2])
      const props = { props: {} }
      const next = vi.fn(async (p) => p)

      await expect(fallbackHandler(props, next)).rejects.toThrow(
        'Handler 2 failed',
      )
    })

    it('should prefer successful handler over default value', async () => {
      const handler1 = vi.fn(async (props, next) => {
        return await next({ ...props, success: true })
      })

      const defaultValue = { props: { default: true } }
      const fallbackHandler = fallback([handler1], defaultValue)
      const props = { props: {} }
      const next = vi.fn(async (p) => p)

      const result = await fallbackHandler(props, next)

      expect(handler1).toHaveBeenCalledTimes(1)
      expect(result).toEqual({ props: {}, success: true })
    })

    it('should handle default value with props merging', async () => {
      const handler1 = vi.fn(async () => {
        throw new Error('Handler 1 failed')
      })

      const defaultValue = { props: { default: true, existing: 'value' } }
      const fallbackHandler = fallback([handler1], defaultValue)
      const props = { props: { existing: 'original' } }
      const next = vi.fn(async (p) => p)

      const result = await fallbackHandler(props, next)

      expect(result).toEqual({ props: { default: true, existing: 'value' } })
    })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { conditional } from './conditional'

describe('conditional', () => {
  it('should run handlers when condition is true', async () => {
    const handler = vi.fn(async (props, next) => {
      return await next({ ...props, a: 1 })
    })
    const condition = vi.fn(() => true)

    const conditionalHandler = conditional(condition, handler)
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(condition).toHaveBeenCalledWith(props)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: {}, a: 1 })
  })

  it('should skip handlers when condition is false', async () => {
    const handler = vi.fn(async () => ({ a: 1 }))
    const condition = vi.fn(() => false)

    const conditionalHandler = conditional(condition, handler)
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(condition).toHaveBeenCalledWith(props)
    expect(handler).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledWith(props)
    expect(result).toEqual({ props: {} })
  })

  it('should support async condition function', async () => {
    const handler = vi.fn(async (props, next) => {
      return await next({ ...props, a: 1 })
    })
    const condition = vi.fn(async () => {
      await Promise.resolve()
      return true
    })

    const conditionalHandler = conditional(condition, handler)
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(condition).toHaveBeenCalledWith(props)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: {}, a: 1 })
  })

  it('should support boolean condition directly', async () => {
    const handler = vi.fn(async (props, next) => {
      return await next({ ...props, a: 1 })
    })

    const conditionalHandler = conditional(true, handler)
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: {}, a: 1 })
  })

  it('should support promise condition', async () => {
    const handler = vi.fn(async (props, next) => {
      return await next({ ...props, a: 1 })
    })
    const condition = Promise.resolve(true)

    const conditionalHandler = conditional(condition, handler)
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: {}, a: 1 })
  })

  it('should run multiple handlers sequentially when condition is true', async () => {
    const handler1 = vi.fn(async (props, next) => {
      const result = await next(props)
      return { ...result, a: 1 }
    })
    const handler2 = vi.fn(async (props, next) => {
      const result = await next(props)
      return { ...result, b: 2 }
    })
    const condition = vi.fn(() => true)

    const conditionalHandler = conditional(condition, [handler1, handler2])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: {}, a: 1, b: 2 })
  })

  it('should skip all handlers when condition is false with multiple handlers', async () => {
    const handler1 = vi.fn(async () => ({ a: 1 }))
    const handler2 = vi.fn(async () => ({ b: 2 }))
    const condition = vi.fn(() => false)

    const conditionalHandler = conditional(condition, [handler1, handler2])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {} })
  })

  it('should pass additional args to condition and handlers', async () => {
    const handler = vi.fn(async (props, next) => {
      return await next(props)
    })
    const condition = vi.fn((props, arg1, arg2) => {
      return arg1 === 'test1' && arg2 === 'test2'
    })

    const conditionalHandler = conditional(condition, handler)
    const props = { props: {} }
    const next = vi.fn(async (p) => p)
    const arg1 = 'test1'
    const arg2 = 'test2'

    await conditionalHandler(props, next, arg1, arg2)

    expect(condition).toHaveBeenCalledWith(props, arg1, arg2)
    expect(handler).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function),
      arg1,
      arg2,
    )
  })

  it('should handle condition based on props', async () => {
    const handler = vi.fn(async (props, next) => {
      return await next({ ...props, admin: true })
    })
    const condition = vi.fn((props) => {
      return props?.props?.user?.role === 'admin'
    })

    const conditionalHandler = conditional(condition, handler)
    const props = { props: { user: { role: 'admin' } } }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(condition).toHaveBeenCalledWith(props)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ props: { user: { role: 'admin' } }, admin: true })
  })

  it('should handle empty handlers array', async () => {
    const condition = vi.fn(() => true)

    const conditionalHandler = conditional(condition, [])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(condition).toHaveBeenCalledWith(props)
    expect(next).toHaveBeenCalledWith(props)
    expect(result).toEqual({ props: {} })
  })

  it('should allow handlers to short-circuit', async () => {
    const handler1 = vi.fn(async (props, next) => {
      return { ...props, shortCircuit: true }
    })
    const handler2 = vi.fn(async () => ({ b: 2 }))
    const condition = vi.fn(() => true)

    const conditionalHandler = conditional(condition, [handler1, handler2])
    const props = { props: {} }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).not.toHaveBeenCalled()
    expect(result).toEqual({ props: {}, shortCircuit: true })
  })

  it('should merge props correctly when condition is true', async () => {
    const handler = vi.fn(async (props, next) => {
      const result = await next(props)
      return {
        ...result,
        props: {
          ...(result.props || {}),
          added: true,
        },
      }
    })
    const condition = vi.fn(() => true)

    const conditionalHandler = conditional(condition, handler)
    const props = { props: { existing: 'value' } }
    const next = vi.fn(async (p) => p)

    const result = await conditionalHandler(props, next)

    expect(result).toEqual({
      props: {
        existing: 'value',
        added: true,
      },
    })
  })
})

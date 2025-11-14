import { describe, it, expect, vi } from 'vitest'
import nextProps from './index'

describe('nextProps', () => {
  it('should execute a single handler', async () => {
    const handler = vi.fn(async (props, next) => {
      return { ...props, a: 1 }
    })

    const getProps = nextProps([handler])
    const result = await getProps()

    expect(handler).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      props: {},
      a: 1,
    })
  })

  it('should execute handlers in sequence when next is called', async () => {
    const handler1 = vi.fn(async (props, next) => {
      const result = await next()
      return { ...result, a: 1 }
    })
    const handler2 = vi.fn(async (props, next) => {
      const result = await next()
      return { ...result, b: 2 }
    })
    const handler3 = vi.fn(async (props, next) => {
      return { ...props, c: 3 }
    })

    const getProps = nextProps([handler1, handler2, handler3])
    const result = await getProps()

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
    expect(handler3).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      c: 3,
      b: 2,
      a: 1,
    })
  })

  it('should allow handlers to short-circuit by not calling next', async () => {
    const handler1 = vi.fn(async (props, next) => {
      return { ...props, a: 1, shortCircuit: true }
    })
    const handler2 = vi.fn(async (props, next) => {
      return { ...props, b: 2 }
    })

    const getProps = nextProps([handler1, handler2])
    const result = await getProps()

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).not.toHaveBeenCalled()
    expect(result).toEqual({
      props: {},
      a: 1,
      shortCircuit: true,
    })
  })

  it('should use default initialProps when not provided', async () => {
    const handler = vi.fn(async (props, next) => {
      return { ...props, a: 1 }
    })

    const getProps = nextProps([handler])
    const result = await getProps()

    expect(handler).toHaveBeenCalledWith({ props: {} }, expect.any(Function))
    expect(result).toEqual({
      props: {},
      a: 1,
    })
  })

  it('should use custom initialProps when provided', async () => {
    const handler = vi.fn(async (props, next) => {
      return { ...props, a: 1 }
    })

    const getProps = nextProps([handler], {
      initialProps: { props: { initial: 'value' } },
    })
    const result = await getProps()

    expect(handler).toHaveBeenCalledWith(
      { props: { initial: 'value' } },
      expect.any(Function),
    )
    expect(result).toEqual({
      props: { initial: 'value' },
      a: 1,
    })
  })

  it('should pass additional args to handlers', async () => {
    const handler = vi.fn(async (props, next, arg1, arg2) => {
      return { ...props, arg1, arg2 }
    })

    const getProps = nextProps([handler])
    const result = await getProps('test1', 'test2')

    expect(handler).toHaveBeenCalledWith(
      { props: {} },
      expect.any(Function),
      'test1',
      'test2',
    )
    expect(result).toEqual({
      props: {},
      arg1: 'test1',
      arg2: 'test2',
    })
  })

  it('should handle empty handlers array', async () => {
    const getProps = nextProps([])
    const result = await getProps()

    expect(result).toEqual({
      props: {},
    })
  })

  it('should allow handlers to modify props', async () => {
    const handler1 = vi.fn(async (props, next) => {
      const result = await next()
      return {
        ...result,
        props: {
          ...(result.props || {}),
          modified: true,
        },
      }
    })
    const handler2 = vi.fn(async (props, next) => {
      return {
        ...props,
        props: {
          ...(props?.props || {}),
          value: 'test',
        },
      }
    })

    const getProps = nextProps([handler1, handler2])
    const result = await getProps()

    expect(result).toEqual({
      props: {
        value: 'test',
        modified: true,
      },
    })
  })

  it('should handle multiple handlers with complex flow', async () => {
    const handler1 = vi.fn(async (props, next) => {
      const result = await next()
      return { ...result, step1: true }
    })
    const handler2 = vi.fn(async (props, next) => {
      const result = await next()
      return { ...result, step2: true }
    })
    const handler3 = vi.fn(async (props, next) => {
      return { ...props, step3: true, final: true }
    })

    const getProps = nextProps([handler1, handler2, handler3])
    const result = await getProps()

    expect(result).toEqual({
      step3: true,
      final: true,
      step2: true,
      step1: true,
    })
  })

  it('should handle initialProps with custom structure', async () => {
    const handler = vi.fn(async (props, next) => {
      return { ...props, added: true }
    })

    const getProps = nextProps([handler], {
      initialProps: { props: { user: 'test' }, meta: { version: 1 } },
    })
    const result = await getProps()

    expect(result).toEqual({
      props: { user: 'test' },
      meta: { version: 1 },
      added: true,
    })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { parallel } from './parallel'

describe('parallel', () => {
  it('should merge results from multiple handlers', async () => {
    const handler1 = vi.fn(async () => ({ a: 1, b: 2 }))
    const handler2 = vi.fn(async () => ({ c: 3, d: 4 }))
    const handler3 = vi.fn(async () => ({ e: 5 }))

    const parallelHandler = parallel([handler1, handler2, handler3])
    const props = {}
    const next = vi.fn()

    const result = await parallelHandler(props, next)

    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
    })
  })

  it('should merge nested props properties from multiple handlers', async () => {
    const handler1 = vi.fn(async () => ({
      a: 1,
      props: { x: 1, y: 2 },
    }))
    const handler2 = vi.fn(async () => ({
      b: 2,
      props: { z: 3, w: 4 },
    }))
    const handler3 = vi.fn(async () => ({
      c: 3,
      props: { v: 5 },
    }))

    const parallelHandler = parallel([handler1, handler2, handler3])
    const props = {}
    const next = vi.fn()

    const result = await parallelHandler(props, next)

    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
      props: {
        x: 1,
        y: 2,
        z: 3,
        w: 4,
        v: 5,
      },
    })
  })

  it('should handle handlers with and without props', async () => {
    const handler1 = vi.fn(async () => ({ a: 1 }))
    const handler2 = vi.fn(async () => ({
      b: 2,
      props: { x: 1 },
    }))
    const handler3 = vi.fn(async () => ({ c: 3 }))

    const parallelHandler = parallel([handler1, handler2, handler3])
    const props = {}
    const next = vi.fn()

    const result = await parallelHandler(props, next)

    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
      props: {
        x: 1,
      },
    })
  })

  it('should handle empty handlers array', async () => {
    const parallelHandler = parallel([])
    const props = {}
    const next = vi.fn()

    const result = await parallelHandler(props, next)

    expect(result).toEqual({})
  })

  it('should pass props, next, and additional args to each handler', async () => {
    const handler1 = vi.fn(async () => ({}))
    const handler2 = vi.fn(async () => ({}))

    const parallelHandler = parallel([handler1, handler2])
    const props = { initial: 'props' }
    const next = vi.fn()
    const arg1 = 'arg1'
    const arg2 = 'arg2'

    await parallelHandler(props, next, arg1, arg2)

    expect(handler1).toHaveBeenCalledWith(props, next, arg1, arg2)
    expect(handler2).toHaveBeenCalledWith(props, next, arg1, arg2)
  })

  it('should handle props with overlapping keys (later handlers override)', async () => {
    const handler1 = vi.fn(async () => ({ a: 1, b: 2 }))
    const handler2 = vi.fn(async () => ({ b: 3, c: 4 }))

    const parallelHandler = parallel([handler1, handler2])
    const props = {}
    const next = vi.fn()

    const result = await parallelHandler(props, next)

    expect(result).toEqual({
      a: 1,
      b: 3, // handler2's value overrides handler1's
      c: 4,
    })
  })

  it('should merge props with overlapping keys (later handlers override)', async () => {
    const handler1 = vi.fn(async () => ({
      props: { x: 1, y: 2 },
    }))
    const handler2 = vi.fn(async () => ({
      props: { y: 3, z: 4 },
    }))

    const parallelHandler = parallel([handler1, handler2])
    const props = {}
    const next = vi.fn()

    const result = await parallelHandler(props, next)

    expect(result).toEqual({
      props: {
        x: 1,
        y: 3, // handler2's value overrides handler1's
        z: 4,
      },
    })
  })
})

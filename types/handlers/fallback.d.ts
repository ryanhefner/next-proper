import type {
  Handler,
  HandlerProps,
  NextFunction,
  HandlerResult,
} from '../index'

/**
 * fallback - Run handlers sequentially until one succeeds (doesn't throw).
 * If a handler throws an error, the next handler is tried.
 * If all handlers fail and a default value is provided, it is returned.
 * Otherwise, the last error is thrown.
 *
 * @param handlers - Array of handlers to try in sequence
 * @param defaultValue - Optional default value to return if all handlers fail.
 *   Can be a function that receives (props, ...args), a promise, or any value.
 * @returns Handler function
 */
export function fallback(
  handlers: Handler[],
  defaultValue?:
    | ((
        props: HandlerProps,
        ...args: any[]
      ) => HandlerResult | Promise<HandlerResult>)
    | HandlerResult
    | Promise<HandlerResult>,
): (
  props: HandlerProps,
  next: NextFunction,
  ...args: any[]
) => Promise<HandlerResult>

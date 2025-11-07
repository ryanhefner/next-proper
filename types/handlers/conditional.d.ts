import type {
  Handler,
  HandlerProps,
  NextFunction,
  HandlerResult,
} from '../index'

/**
 * conditional - Run handlers conditionally based on a predicate function.
 *
 * @param condition - Function that receives (props, ...args) and returns boolean, or a boolean/promise
 * @param handlers - Single handler or array of handlers to run if condition is true
 * @returns Handler function
 */
export function conditional(
  condition:
    | ((props: HandlerProps, ...args: any[]) => boolean | Promise<boolean>)
    | boolean
    | Promise<boolean>,
  handlers: Handler | Handler[],
): Handler

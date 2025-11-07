import type {
  Handler,
  HandlerProps,
  NextFunction,
  HandlerResult,
} from '../index'

/**
 * parallel - Run multiple handlers in parallel and merge their results.
 *
 * @param handlers - Array of handlers to run in parallel
 * @returns Handler function
 */
export function parallel(handlers: Handler[]): Handler

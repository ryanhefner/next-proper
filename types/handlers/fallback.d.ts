/**
 * fallback - Run handlers sequentially until one succeeds (doesn't throw).
 * If a handler throws an error, the next handler is tried.
 * If all handlers fail and a default value is provided, it is returned.
 * Otherwise, the last error is thrown.
 *
 * @param {Function[]} handlers - Array of handlers to try in sequence
 * @param {Function|Promise|any=} defaultValue - Optional default value to return if all handlers fail.
 *   Can be a function that receives (props, ...args), a promise, or any value.
 * @return {Function} Handler function
 */
export function fallback(
  handlers: Function[],
  defaultValue?:
    | ((props: any, ...args: any[]) => any | Promise<any>)
    | any
    | Promise<any>,
): (props: any, next: Function, ...args: any[]) => Promise<any>

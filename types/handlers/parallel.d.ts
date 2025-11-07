/**
 * parallel - Run multiple handlers in parallel and merge their results.
 *
 * @param {Function[]} handlers - Array of handlers to run in parallel
 * @return {Function} Handler function
 */
export function parallel(
  handlers: Function[],
): (props: any, next: Function, ...args: any[]) => Promise<any>

/**
 * conditional - Run handlers conditionally based on a predicate function.
 *
 * @param {Function|Promise<boolean>|boolean} condition - Function that receives (props, ...args) and returns boolean, or a boolean/promise
 * @param {Function|Function[]} handlers - Single handler or array of handlers to run if condition is true
 * @return {Function} Handler function
 */
export function conditional(
  condition:
    | ((props: any, ...args: any[]) => boolean | Promise<boolean>)
    | boolean
    | Promise<boolean>,
  handlers: Function | Function[],
): (props: any, next: Function, ...args: any[]) => Promise<any>

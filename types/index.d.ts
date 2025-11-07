/**
 * Props object that handlers receive and can modify.
 * Can contain a `props` property (for Next.js props) and other metadata.
 */
export interface HandlerProps {
  props?: Record<string, any>
  [key: string]: any
}

/**
 * Function to continue the handler chain with updated props
 */
export type NextFunction = (props: HandlerProps) => Promise<HandlerResult>

/**
 * Result that handlers can return (matches Next.js return types).
 * Handlers can return standard Next.js responses or the result of calling next().
 */
export type HandlerResult =
  | { props: Record<string, any> }
  | { redirect: { destination: string; permanent: boolean } }
  | { notFound: true }
  | { revalidate?: number | boolean }
  | HandlerProps

/**
 * Handler function signature
 */
export type Handler = (
  props: HandlerProps,
  next: NextFunction,
  ...args: any[]
) => Promise<HandlerResult>

/**
 * Options for nextProps
 */
export interface NextPropsOptions {
  initialProps?: HandlerProps
}

/**
 * nextProps - Compose props providers for `getServerSideProps` and `getStaticProps` NextJS methods.
 *
 * @param handlers - Array of handler functions
 * @param options - Optional configuration
 * @returns A function compatible with `getServerSideProps` or `getStaticProps`
 */
declare function nextProps(
  handlers: Handler[],
  options?: NextPropsOptions,
): (...args: any[]) => Promise<HandlerResult>

export default nextProps

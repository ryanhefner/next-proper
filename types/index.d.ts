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
 * Redirect configuration for Next.js
 * Matches Next.js Redirect type from getServerSideProps and getStaticProps
 */
export interface Redirect {
  destination: string
  permanent?: boolean
  statusCode?: number
}

/**
 * Result type matching Next.js GetServerSidePropsResult
 * Compatible with getServerSideProps return values
 */
export type GetServerSidePropsResult<P = Record<string, any>> =
  | { props: P }
  | { redirect: Redirect }
  | { notFound: true }

/**
 * Result type matching Next.js GetStaticPropsResult
 * Compatible with getStaticProps return values
 */
export type GetStaticPropsResult<P = Record<string, any>> =
  | { props: P }
  | { redirect: Redirect }
  | { notFound: true }
  | { revalidate?: number | boolean }

/**
 * Result that handlers can return (matches Next.js return types).
 * Supports all return types for getServerSideProps, getStaticProps, and related Next.js data fetching methods.
 * Handlers can return standard Next.js responses or the result of calling next().
 * This is a union of GetServerSidePropsResult, GetStaticPropsResult, and HandlerProps for flexibility.
 */
export type HandlerResult =
  | GetServerSidePropsResult
  | GetStaticPropsResult
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

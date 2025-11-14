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
  permanent: boolean
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
  | { props: P; revalidate?: number | boolean }
  | { redirect: Redirect }
  | { notFound: true }
  | { revalidate: number | boolean }

/**
 * HandlerProps with required props - used when handlers return props through the chain.
 * This type ensures compatibility with Next.js result types by requiring props to be present.
 * Note: This is distinct from { props: P } to allow additional metadata properties.
 * Explicitly excludes redirect and notFound to prevent type conflicts.
 */
export type HandlerPropsWithProps = {
  props: Record<string, any>
  redirect?: never
  notFound?: never
  [key: string]: any
}

/**
 * Result that handlers can return (matches Next.js return types).
 * Supports all return types for getServerSideProps, getStaticProps, and related Next.js data fetching methods.
 * Handlers can return standard Next.js responses or the result of calling next().
 * HandlerPropsWithProps is included for flexibility when handlers return props through the chain with additional metadata.
 *
 * This type excludes the standalone { revalidate } variant from GetStaticPropsResult to ensure
 * compatibility with GetServerSidePropsResult. The revalidate option can still be used as a
 * property on the props object for getStaticProps.
 */
export type HandlerResult<P = Record<string, any>> =
  | { props: P }
  | { props: P; revalidate?: number | boolean }
  | { redirect: Redirect }
  | { notFound: true }
  | HandlerPropsWithProps

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
 *
 * Note: The return type includes GetStaticPropsResult which has revalidate.
 * When used with getServerSideProps, TypeScript may require a type assertion:
 * `export const getServerSideProps = nextProps([...]) as GetServerSideProps<Props>`
 * This is safe as Next.js will ignore the revalidate property.
 */
declare function nextProps(
  handlers: Handler[],
  options?: NextPropsOptions,
): <P extends Record<string, any> = Record<string, any>>(
  ...args: any[]
) => Promise<HandlerResult<P>>

export default nextProps

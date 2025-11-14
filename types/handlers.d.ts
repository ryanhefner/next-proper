export { parallel } from './handlers/parallel'
export { conditional } from './handlers/conditional'
export { fallback } from './handlers/fallback'

export type {
  Handler,
  HandlerProps,
  HandlerPropsWithProps,
  HandlerResult,
  NextFunction,
  NextPropsOptions,
  Redirect,
  GetServerSidePropsResult,
  GetStaticPropsResult,
} from './index'

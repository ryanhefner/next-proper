import type { Redirect } from 'next'

interface Config {
  initialState?: any;
}

declare async function init(ctx: any): Promise<{ props: any } | { notFound: boolean } | { redirect: Redirect }>;

declare function handler(props: Props, next, ...args: any[]): Promise<GetServerSidePropsResult<any>>;

declare function nextHandlers(handlers: handler[]): init;

declare function nextProps({ initialState }: Config): nextHandlers;

export = nextProps

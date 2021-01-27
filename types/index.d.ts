interface Config {
  initialState?: any;
}

interface Props {
  notFound?: boolean;
  props?: any;
  redirect?: any;
}

declare function init(ctx: any): Props;

declare function handler(props: Props, next, ...args: any[]): Props;

declare function nextHandlers(handlers: handler[]): init;

declare function nextProps({ initialState }: Config): nextHandlers;

export = nextProps

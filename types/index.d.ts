export default nextProps;
/**
 * nextProps - Compose props providers for `getServerSideProps` and `getStaticProps` NextJS methods.
 *
 * @param {Object=} config
 * @param {Object=} config.initialProps
 * @return {(handlers: ((props: any, next: (((props: any) => Promise<GetServerSidePropsResult<any>>), ...args: any[]) => Promise<GetServerSidePropsResults<any>>}
 */
declare function nextProps(config?: any | undefined): (handlers: (props: any, next: (props: any) => Promise<any>, ...args: any[]) => Promise<any>) => any;

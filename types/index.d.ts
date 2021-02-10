export default nextProps;
/**
 * nextProps - Compose props providers for `getServerSideProps` and `getStaticProps` NextJS methods.
 *
 * @param {Object=} config
 * @param {Object=} config.initialProps
 * @return {(props: any, next: any, ...args: any[]) => Promise<any>}
 */
declare function nextProps(config?: any | undefined): (props: any, next: any, ...args: any[]) => Promise<any>;

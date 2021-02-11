export default nextProps;
/**
 * nextProps - Compose props providers for `getServerSideProps` and `getStaticProps` NextJS methods.
 *
 * @param {Function[]} handlers
 * @param {Object=} options
 * @param {Object=} options.initialProps
 * @return {(...args: any[]) => Promise<any>}
 */
declare function nextProps(handlers: Function[], options?: any | undefined): (...args: any[]) => Promise<any>;

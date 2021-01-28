export default nextProps;
/**
 * nextProps - Compose props providers for `getServerSideProps` and `getStaticProps` NextJS methods.
 *
 * @param {{ initialProps: any }}
 * @return {(handlers: ((props: any, next: (((props: any) => Promise<GetServerSidePropsResult<{ props: any } | { notFound: boolean } | { redirect: Redirect }>>), ...args: any[]) => Promise<GetServerSidePropsResults<{ props: any } | { notFound: boolean } | { redirect: Redirect }>)[]) => (...args: any[]) => Promise<GetServerSidePropsResult<{ props: any } | { notFound: boolean } | { redirect: Redirect }>>}
 */
declare function nextProps({ initialProps }: {
    initialProps: any;
}): (handlers: ((props: any, next: (props: any) => Promise<any>, ...args: any[]) => Promise<any>)[]) => (...args: any[]) => Promise<any>;

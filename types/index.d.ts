export default nextProps;
/**
 * @param {{ initialProps: any }}
 * @return {(handlers: ((props: any, next: (((props: any) => Promise<GetServerSidePropsResult<{ props: any } | { notFound: boolean } | { redirect: Redirect }>>), ...args: any[]) => Promise<GetServerSidePropsResults<{ props: any } | { notFound: boolean } | { redirect: Redirect }>)[]) => (...args: any[]) => Promise<GetServerSidePropsResult<{ props: any } | { notFound: boolean } | { redirect: Redirect }>>}
 */
declare function nextProps({ initialProps }: {
    initialProps: any;
}): (handlers: ((props: any, next: (props: any) => Promise<any>, ...args: any[]) => Promise<any>)[]) => (...args: any[]) => Promise<any>;

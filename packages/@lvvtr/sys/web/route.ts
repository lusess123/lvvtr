export interface IRouteConfig
{
    path: string;
    name?: string;
    component?: any;
    components?: any;
    redirect?: any;
    alias?: string | string[];
    children?: IRouteConfig[];
    meta?: any;
    beforeEnter?: any;
    props?: any;
    caseSensitive?: boolean;
    pathToRegexpOptions?: any;

}
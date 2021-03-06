import Main from './../view/main.vue';
import hull from './../view/hull.vue';

import getapps from "../../sys/web/appget";

const _getMainRoute = () => {
  

  const _apps = getapps();
  let MainRoute = [];
  let RootRoute = [];

  _apps.forEach(a => {
    if (a.MainRoute) {
      MainRoute =  MainRoute.concat(a.MainRoute)
    }
    if (a.RootRoute) {
      RootRoute =  RootRoute.concat(a.RootRoute)
    }
  });
  //core.alert(_routes);
  return  {MainRoute,RootRoute};
  // _apps.
}

const _routes = _getMainRoute();

export const MainRoutes = {

  path : '/',
  name : 'root',
  redirect : '/devlist',
  component : Main,
  children : [

    {
      path: '/web',
      name: 'web',
      component: hull
    }, {
      path: '/web/:pagename',
      name: 'web0',
      component: hull
    }, {
      path: '/web/:pagename/:p1',
      name: 'web1',
      component: hull
    }, {
      path: '/web/:pagename/:p1/:p2',
      name: 'web2',
      component: hull
    }, {
      path: '/web/:pagename/:p1/:p2/:p3',
      name: 'web3',
      component: hull
    },
    ..._routes.MainRoute

  ]
}

export const RootRoutes = _routes.RootRoute;

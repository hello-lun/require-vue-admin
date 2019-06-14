define([
  'vue',
  'vue-router',
  'util/tool'
],function(
  Vue,
  VueRouter,
  tool
) {
  'use strict';

  Vue.use(VueRouter);

  var routes = [
    {
      path: '*',
      redirect: '/device'
    },

    // {
    //   name: 'workbentch',
    //   path: '/workbentch',
    //   component: function () { 
    //     return tool.resolveComponent('modules/workbentch/v1/views/index/index');
    //   }
    // },

    // /* 客户管理模块(customer) */

    // // 用户账户管理
    // { 
    //   name: 'user-account',
    //   path: '/customer/user-account-admin',
    //   component: function () {
    //     return tool.resolveComponent('modules/customer/v1/views/user-account-admin/index');
    //   }
    // },
    // // 客户管理
    // { 
    //   name: 'customer-admin',
    //   path: '/customer/admin',
    //   component: function () { 
    //     return tool.resolveComponent('modules/customer/v1/views/customer-admin/index');
    //   }
    // },
    // // 门店管理
    // { 
    //   name: 'store-admin',
    //   path: '/customer/store',
    //   component: function () { 
    //     return tool.resolveComponent('modules/customer/v1/views/store-admin/index');
    //   }
    // },
    // // 终端设备管理
    // { 
    //   name: 'terminal-admin',
    //   path: '/customer/terminal',
    //   component: function () { 
    //     return tool.resolveComponent('modules/customer/v1/views/terminal-admin/index');
    //   }
    // },
    // // 微服务管理
    // { 
    //   name: 'micro-services-admin',
    //   path: '/customer/micro-services',
    //   component: function () { 
    //     return tool.resolveComponent('modules/customer/v1/views/micro-service-admin/index');
    //   }
    // },

    // /* 组织管理模块(organization) */
    // { 
    //   name: 'organization',
    //   path: '/organization',
    //   component: function () { 
    //     return tool.resolveComponent('modules/organization/v1/views/orginzation/index');
    //   }
    // },

    // /* 会员模块(member) */

    // // 会员列表
    // { 
    //   name: 'member',
    //   path: '/member',
    //   component: function () { 
    //     return tool.resolveComponent('modules/member/v1/views/index/index');
    //   }
    // },

    // /* 商品模块(goods) */
    // // 商品列表
    // {
    //   name: 'goods-list',
    //   path: '/goods/list',
    //   component: function () { 
    //     return tool.resolveComponent('modules/goods/v1/views/index/index');
    //   }
    // },
    // // 商品售卖视图
    // {
    //   name: 'sale-views',
    //   path: '/goods/sale-views',
    //   component: function () { 
    //     return tool.resolveComponent('modules/goods/v1/views/salesview/index');
    //   }
    // },
    // // 套票样式布局（调试）
    // {
    //   name: 'ticket-layout',
    //   path: '/goods/ticket-layout',
    //   component: function () {
    //     return tool.resolveComponent('framework/components/ticket-style-layout-manager/layout-manager');
    //   }
    // },

    // /* 活动模块(sale-promotion) */

    // // 活动促销
    // {
    //   name: 'sale-promotion',
    //   path: '/activity/sale-promotion',
    //   component: function () {
    //     return tool.resolveComponent('modules/sale-promotion/v1/views/index/index');
    //   }
    // },

    // /* 游乐项目(game-project) */

    // // 虚拟货币
    // {
    //   name: 'virtual-currency',
    //   path: '/game-project/virtual-currency',
    //   component: function () { 
    //     return tool.resolveComponent('modules/virtual-currency/v1/views/index/index');
    //   }
    // },
    // // 项目
    // {
    //   name: 'project-list',
    //   path: '/game-project/project-list',
    //   component: function () { 
    //     return tool.resolveComponent('modules/game-project/v1/views/index/index');
    //   }
    // },

    // /* 终端及应用管理 */

    // // 终端类型
    // {
    //   name: 'terminal-type',
    //   path: '/terminal/type',
    //   component: function () { 
    //     return tool.resolveComponent('modules/terminal/v1/views/terminal-type/index');
    //   }
    // },
    // // 终端应用类型
    // {
    //   name: 'terminal-app-type',
    //   path: '/terminal/app-type',
    //   component: function () { 
    //     return tool.resolveComponent('modules/terminal/v1/views/terminal-app-type/index');
    //   }
    // },
    // // 终端应用
    // {
    //   name: 'terminal-app',
    //   path: '/terminal/app',
    //   component: function () { 
    //     return tool.resolveComponent('modules/terminal/v1/views/terminal-app/index');
    //   }
    // },
    // 固件管理
    {
      name: 'firmware',
      path: '/firmware',
      component: function () {
        return tool.resolveComponent('modules/firmware/v1/views/index');
      }
    },
    // 软件管理
    {
      name: 'software',
      path: '/software',
      component: function () { 
        return tool.resolveComponent('modules/software/v1/views/index');
      }
    },
    // 资源包管理
    {
      name: 'assets',
      path: '/assets',
      component: function () { 
        return tool.resolveComponent('modules/assets/v1/views/index');
      }
    },
    // 设备管理
    {
      name: 'device',
      path: '/device',
      component: function () { 
        return tool.resolveComponent('modules/device/v1/views/index');
      }
    },
    // 账户管理
    {
      name: 'account',
      path: '/account',
      component: function () { 
        return tool.resolveComponent('modules/account/v1/views/index');
      }
    },
    // 意见反馈
    {
      name: 'feedback',
      path: '/feedback',
      component: function () { 
        return tool.resolveComponent('modules/feedback/v1/views/index');
      }
    },
    // 客户管理
    {
      name: 'customer',
      path: '/customer',
      component: function () { 
        return tool.resolveComponent('modules/customer/v1/views/index');
      }
    },
    // 客户管理
    {
      name: 'audit',
      path: '/audit',
      component: function () { 
        return tool.resolveComponent('modules/customer/v1/views/audit');
      }
    },
  ];

  var router = new VueRouter ({
    routes: routes
  });

  router.beforeResolve(function (to, from, next) {
    var toName = to.name;
    var toMatched = to.matched[0];
    if (toMatched) {
      to.meta.componentName = toMatched.components.default.name;
    }
    // console.log(arguments);
    next();
  });
  
  return router;
});
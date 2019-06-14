define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function (tool, BaseModule) {
    'use strict';

    function Common() {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        this.menu = function (data) {
            // if (globalConfig.mock.status) {
            if (true) {
                var resData = [
                    // {
                    //     "Title": "工作台",
                    //     "Icon": "ych-icon-gongzuotai",
                    //     "Name": "workbentch",
                    //     "Path": "/workbentch"
                    // },

                    {
                        "Title": "设备管理",
                        "Icon": "ych-icon-shangpin",
                        "Name": "device",
                        "Path": "/device"
                    },

                    {
                        "Title": "版本管理",
                        "Icon": "ych-icon-shangpin",
                        "Name": "manager",
                        "SubMenus": [
                            {
                                "Title": "固件管理",
                                "Icon": "ych-icon-shangpin",
                                "Name": "firmware",
                                "Path": "/firmware"
                            },
        
                            {
                                "Title": "软件管理",
                                "Icon": "ych-icon-shangpin",
                                "Name": "software",
                                "Path": "/software"
                            },
        
                            {
                                "Title": "资源管理",
                                "Icon": "ych-icon-shangpin",
                                "Name": "assets",
                                "Path": "/assets"
                            },
                        ]
                    },

                    {
                        "Title": "客户管理",
                        "Icon": "ych-icon-shangpin",
                        "Name": "customer",
                        "Path": "/customer"
                    },

                    {
                        "Title": "资料审核",
                        "Icon": "ych-icon-shangpin",
                        "Name": "audit",
                        "Path": "/audit"
                    },

                    {
                        "Title": "意见反馈",
                        "Icon": "ych-icon-shangpin",
                        "Name": "feedback",
                        "Path": "/feedback"
                    },

                    {
                        "Title": "账号管理",
                        "Icon": "ych-icon-shangpin",
                        "Name": "account",
                        "Path": "/account"
                    },

                    // {
                    //     "Title": " 会员",
                    //     "Name": "member",
                    //     "Icon": "ych-icon-huiyuan",
                    //     "SubMenus": [
                    //         {
                    //             "Title": "会员",
                    //             "Path": "/member"
                    //         }
                    //     ]
                    // },

                    // {
                    //     "Title": "项目",
                    //     "Name": "game-project",
                    //     "Icon": "ych-icon-xiangmu",
                    //     "SubMenus": [
                    //         {
                    //             "Title": "虚拟货币",
                    //             "Path": "/game-project/virtual-currency",
                    //         },
                    //         {
                    //             "Title": "项目",
                    //             "Path": "/game-project/project-list",
                    //         }
                    //     ]
                    // },

                    // {
                    //     "Title": "组织管理",
                    //     "Icon": "ych-icon-zuzhi",
                    //     "Name": "organization",
                    //     "Path": "/organization"
                    // },

                    // {
                    //     "Title": "客户管理",
                    //     "Name": "customer",
                    //     "Icon": "",
                    //     "SubMenus": [
                    //         {
                    //             "Title": "用户账户管理",
                    //             "Path": "/customer/user-account-admin",
                    //         },
                    //         {
                    //             "Title": "客户管理",
                    //             "Path": "/customer/admin",
                    //         },
                    //         {
                    //             "Title": "门店管理",
                    //             "Path": "/customer/store",
                    //         },
                    //         {
                    //             "Title": "终端设备管理",
                    //             "Path": "/customer/terminal",
                    //         },
                    //         {
                    //             "Title": "微服务管理",
                    //             "Path": "/customer/micro-services",
                    //         },
                    //     ]
                    // },
                    
                    // {
                    //     "Title": "活动",
                    //     "Name": "activity",
                    //     "Icon": "",
                    //     "SubMenus": [
                    //         {
                    //             "Title": "促销",
                    //             "Path": "/activity/sale-promotion",
                    //         }
                    //     ]
                    // },
                    
                    
                    // {
                    //     "Title": "终端及应用管理",
                    //     "Name": "terminal",
                    //     "Icon": "",
                    //     "SubMenus": [
                    //         {
                    //             "Title": "终端类型",
                    //             "Path": "/terminal/type",
                    //         },
                    //         {
                    //             "Title": "终端应用类型",
                    //             "Path": "/terminal/app-type",
                    //         },
                    //         {
                    //             "Title": "终端应用",
                    //             "Path": "/terminal/app",
                    //         },
                    //     ]
                    // },
                ];

                return Promise.resolve({ Data: resData });
            }
            return this.get('/Customer/api/v1/Menu/GetTree', data);
        }

    }

    tool.inheritPrototype(Common, BaseModule);

    return new Common();
});
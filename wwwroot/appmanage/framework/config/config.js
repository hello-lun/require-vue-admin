!(function (window) {
    var config = {
        baseUrl: '/appmanage',
        // mock配置
        mock: {
            // 状态 true/false/'private'
            status: true,
            // url: 'http://neidebug.youcaihua.net:8081/nei/mock'
            url: 'https://yuntaidev02.youcaihua.net'
            // url: 'https://www.rapa.vip',
            // url: 'https://zh.rapa.vip',
        },
        app: {
            // 身份验证
            'identify': {
                host: location.origin
            },
            // 前端框架目录
            'framework': {
                pathname: 'framework',
                host: location.origin
            },
            // 商户
            'Customer': {
                pathname: 'customer'
            },
            // 组织管理
            'organization': {
                pathname: 'organization'
            },
            // 工作台
            'Workbranch': {
                pathname: 'workbentch'
            },
            // 会员
            'Member': {
                pathname: 'member'
            },
            // 商品
            'Goods': {
                pathname: 'goods'
            },

            'POS': {
                pathname: 'pos'
            },

            'VirtualCurrency': {
                pathname: 'virtual-currency'
            },
            'gameProject': {
                pathname: 'game-project'
            },
            'terminal': {
                pathname: 'terminal'
            },
            'firmware': {
                pathname: 'firmware'
            },
            'software': {
                pathname: 'software'
            },
            'assets': {
                pathname: 'assets'
            },
            'device': {
                pathname: 'device'
            },
            'feedback': {
                pathname: 'feedback'
            },
            'account': {
                pathname: 'account'
            },
            'audit': {
                pathname: 'audit'
            },
        }
    };

    Object.defineProperties(window, {
        'globalConfig': { value: config }
    });
})(window)
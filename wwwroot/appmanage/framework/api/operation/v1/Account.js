define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function AccountService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获得账号列表
        this.AccountList = function (data) {
            return this.get('/operation/api/v1/Account/AccountList', data);
        };

        // 修改账号信息
        this.AccountEdit = function (data) {
            return this.post('/operation/api/v1/Account/AccountEdit', data);
        };

        // 新建账号
        this.AccountCreate = function (data) {
            return this.post('/operation/api/v1/Account/AccountCreate', data);
        };

        // 删除账号
        this.AccountDelete = function (data) {
            return this.post('/operation/api/v1/Account/AccountDelete', data);
        };

        // 登录
        this.Login = function (data) {
            return this.post('/operation/api/v1/Account/Login', data, {
                isLogin: true
            });
        };
//{actions}
    }

    tool.inheritPrototype(AccountService, BaseModule);

    return new AccountService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function UserService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增用户
        this.Create = function (data) {
            return this.post('/Customer/api/v1/User/Create', data);
        };

        // 编辑用户
        this.Edit = function (data) {
            return this.put('/Customer/api/v1/User/Edit', data);
        };

        // 获取用户明细
        this.GetID = function (data) {
            return this.get('/Customer/api/v1/User/GetID', data);
        };

        // 删除用户
        this.Delete = function (data) {
            return this.delete('/Customer/api/v1/User/Delete', data);
        };

        // 获取用户明细
        this.Search = function (data) {
            return this.get('/Customer/api/v1/User/Search', data);
        };

        // 变更用户状态
        this.ChangeState = function (data) {
            return this.put('/Customer/api/v1/User/ChangeState', data);
        };

        // 获取用户明细
        this.Login = function (data) {
            return this.get('/Customer/api/v1/User/Login', data);
        };

        // 重置用户密码-UI
        this.ResetPassword = function (data) {
            return this.put('/Customer/api/v1/User/ResetPassword', data);
        };

        // 重置用户密码-UI
        this.RetrievePassword = function (data) {
            return this.put('/Customer/api/v1/User/RetrievePassword', data);
        };

        // 获取用户明细
        this.GetVerificationCode = function (data) {
            return this.get('/Customer/api/v1/User/GetVerificationCode', data);
        };
//{actions}
    }

    tool.inheritPrototype(UserService, BaseModule);

    return new UserService();
});

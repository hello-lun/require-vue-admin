define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LoginService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 账号登录—UI
        this.LoginByAccount = function (data) {
            return this.get('/Organization/api/V1/Login/LoginByAccount', data);
        };

        // 员工卡登录-UI
        this.LoginByCardCode = function (data) {
            return this.get('/Organization/api/V1/Login/LoginByCardCode', data);
        };

        // 员工卡登录-UI
        this.LoginByPhoneNumber = function (data) {
            return this.get('/Organization/api/V1/Login/LoginByPhoneNumber', data);
        };

        // 员工卡登录-UI
        this.GetVerificationCode = function (data) {
            return this.get('/Organization/api/V1/Login/GetVerificationCode', data);
        };

        // 员工卡登录-UI
        this.ResetPassword = function (data) {
            return this.put('/Organization/api/V1/Login/ResetPassword', data);
        };

        // 员工卡登录-UI
        this.RetrievePassword = function (data) {
            return this.put('/Organization/api/V1/Login/RetrievePassword', data);
        };
//{actions}
    }

    tool.inheritPrototype(LoginService, BaseModule);

    return new LoginService();
});

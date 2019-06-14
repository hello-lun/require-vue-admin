define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function AccountService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.Logout = function (data) {
            return this.post('/Identity/api/V1/Account/Logout', data);
        };

        // 通过账号密码登录,可能需要验证码,如果ErrorCode=20001,消息体会就是ImgCodeID,通过/Identity/api/V1/LoginImgCode获取图形验证码,登录成功后将Token放到请求头的Authorization字段就可进行身份认证,系统将自动进行续期不需要更换Token
        this.Login = function (data) {
            return this.post('/Identity/api/V1/Account/Login', data, {
                isLogin: true
            });
        };

        // 获取登录信息,如果ErrorCode=20002,等于需要重新登录
        this.GetLoginInfo = function (data) {
            return this.get('/Identity/api/V1/Account/GetLoginInfo', data);
        };

        // 
        this.ForgetPassword = function (data) {
            return this.post('/Identity/api/V1/Account/ForgetPassword', data);
        };

        // 
        this.ResetPassword = function (data) {
            return this.post('/Identity/api/v1/Account/ResetPassword', data);
        };

        // 
        this.ResetPassword = function (data) {
            return this.post('/Identity/api/v1/Account/ResetPassword', data);
        };
//{actions}
    }

    tool.inheritPrototype(AccountService, BaseModule);

    return new AccountService();
});

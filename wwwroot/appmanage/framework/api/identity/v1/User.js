define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function UserService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.Login = function (data) {
            return this.get('/Identity/api/V1/User/Login', data);
        };
//{actions}
    }

    tool.inheritPrototype(UserService, BaseModule);

    return new UserService();
});

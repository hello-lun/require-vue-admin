define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function FunctionalAuthService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取相应权限
        this.GetFunctionalAuth = function (data) {
            return this.get('/Organization/api/V1/FunctionalAuth/GetFunctionalAuth', data);
        };

        // 保存权限
        this.SaveFunctionalAuth = function (data) {
            return this.post('/Organization/api/V1/FunctionalAuth/SaveFunctionalAuth', data);
        };

        // 获取上级权限
        this.GetParentFunctionalAuth = function (data) {
            return this.get('/Organization/api/V1/FunctionalAuth/GetParentFunctionalAuth', data);
        };

        // 保存同步上级权限(跟随上级权限)
        this.SaveParentFunctionalAuth = function (data) {
            return this.post('/Organization/api/V1/FunctionalAuth/SaveParentFunctionalAuth', data);
        };
//{actions}
    }

    tool.inheritPrototype(FunctionalAuthService, BaseModule);

    return new FunctionalAuthService();
});

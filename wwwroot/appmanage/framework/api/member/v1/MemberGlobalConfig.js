define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function MemberGlobalConfigService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 设置会员初始密码
        this.SetMemberGlobalConfig = function (data) {
            return this.post('/Member/api/V1/MemberGlobalConfig/SetMemberGlobalConfig', data);
        };

        // 获取全局会员初始密码
        this.GetMemberGlobalConfig = function (data) {
            return this.get('/Member/api/V1/MemberGlobalConfig/GetMemberGlobalConfig', data);
        };
//{actions}
    }

    tool.inheritPrototype(MemberGlobalConfigService, BaseModule);

    return new MemberGlobalConfigService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerGlobalConfigClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 设置会员全局配置
        this.SetLeaguerGlobalConfig = function (data) {
            return this.post('/Leaguer/internal/v1/LeaguerGlobalConfigClass/SetLeaguerGlobalConfig', data);
        };

        // 获取会员全局配置
        this.GetLeaguerGlobalConfig = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerGlobalConfigClass/GetLeaguerGlobalConfig', data);
        };

        // 获取所有全局默认会员初始密码
        this.GetLeaguerInitialPasswordList = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerGlobalConfigClass/GetLeaguerInitialPasswordList', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerGlobalConfigClassService, BaseModule);

    return new LeaguerGlobalConfigClassService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function ModuleInTenantService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 根据门店ID获取微服务列表
        this.TenantModuleList = function (data) {
            return this.get('/Customer/api/v1/ModuleInTenant/TenantModuleList', data);
        };

        // 修改门店微服务状态
        this.ChangeIsEnable = function (data) {
            return this.put('/Customer/api/v1/ModuleInTenant/ChangeIsEnable', data);
        };
//{actions}
    }

    tool.inheritPrototype(ModuleInTenantService, BaseModule);

    return new ModuleInTenantService();
});

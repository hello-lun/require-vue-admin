define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function TenantService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 创建门店
        this.Create = function (data) {
            return this.post('/Customer/api/v1/Tenant/Create', data);
        };

        // 删除门店
        this.Delete = function (data) {
            return this.delete('/Customer/api/v1/Tenant/Delete', data);
        };

        // 修改门店信息
        this.Edit = function (data) {
            return this.put('/Customer/api/v1/Tenant/Edit', data);
        };

        // 获取门店详细
        this.GetInfo = function (data) {
            return this.get('/Customer/api/v1/Tenant/GetInfo', data);
        };

        // 查询门店列表
        this.Search = function (data) {
            return this.get('/Customer/api/v1/Tenant/Search', data);
        };
//{actions}
    }

    tool.inheritPrototype(TenantService, BaseModule);

    return new TenantService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function MenuInTenantService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增门店菜单UI
        this.Create = function (data) {
            return this.post('/Customer/api/v1/MenuInTenant/Create', data);
        };

        // 编辑门店菜单UI
        this.Edit = function (data) {
            return this.put('/Customer/api/v1/MenuInTenant/Edit', data);
        };

        // 获取门店菜单明细UI
        this.GetID = function (data) {
            return this.get('/Customer/api/v1/MenuInTenant/GetID', data);
        };

        // 获取门店菜单TreeUI
        this.GetTree = function (data) {
            return this.get('/Customer/api/v1/MenuInTenant/GetTree', data);
        };

        // 删除门店菜单UI
        this.Delete = function (data) {
            return this.delete('/Customer/api/v1/MenuInTenant/Delete', data);
        };
//{actions}
    }

    tool.inheritPrototype(MenuInTenantService, BaseModule);

    return new MenuInTenantService();
});

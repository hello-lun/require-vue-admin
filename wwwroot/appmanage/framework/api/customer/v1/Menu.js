define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function MenuService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增菜单UI
        this.Create = function (data) {
            return this.post('/Customer/api/v1/Menu/Create', data);
        };

        // 编辑菜单UI
        this.Edit = function (data) {
            return this.put('/Customer/api/v1/Menu/Edit', data);
        };

        // 获取菜单明细UI
        this.GetID = function (data) {
            return this.get('/Customer/api/v1/Menu/GetID', data);
        };

        // 获取菜单TreeUI
        this.GetTree = function (data) {
            return this.get('/Customer/api/v1/Menu/GetTree', data);
        };

        // 删除菜单UI
        this.Delete = function (data) {
            return this.delete('/Customer/api/v1/Menu/Delete', data);
        };
//{actions}
    }

    tool.inheritPrototype(MenuService, BaseModule);

    return new MenuService();
});

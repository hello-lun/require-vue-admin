define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function ModuleService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增微服务
        this.Create = function (data) {
            return this.post('/Customer/api/v1/Module/Create', data);
        };

        // 编辑微服务
        this.Edit = function (data) {
            return this.put('/Customer/api/v1/Module/Edit', data);
        };

        // 根据ID获取微服务
        this.GetByID = function (data) {
            return this.get('/Customer/api/v1/Module/GetByID', data);
        };

        // 删除微服务
        this.Delete = function (data) {
            return this.delete('/Customer/api/v1/Module/Delete', data);
        };

        // 查询微服务
        this.Search = function (data) {
            return this.get('/Customer/api/v1/Module/Search', data);
        };

        // 变更微服务状态UI
        this.ChangeState = function (data) {
            return this.put('/Customer/api/v1/Module/ChangeState', data);
        };
//{actions}
    }

    tool.inheritPrototype(ModuleService, BaseModule);

    return new ModuleService();
});

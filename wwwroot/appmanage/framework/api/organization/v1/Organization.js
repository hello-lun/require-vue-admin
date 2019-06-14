define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function OrganizationService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取当前登陆用户所在门店的树形组织结构
        this.GetTree = function (data) {
            return this.get('/Organization/api/V1/Organization/GetTree', data);
        };

        // 根据节点获取下级组织
        this.GetChildsByID = function (data) {
            return this.get('/Organization/api/V1/Organization/GetChildsByID', data);
        };
//{actions}
    }

    tool.inheritPrototype(OrganizationService, BaseModule);

    return new OrganizationService();
});

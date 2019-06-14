define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function TerminalManagementService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 查询运营平台终端管理列表
        this.Search = function (data) {
            return this.get('/Terminal/api/V1/TerminalManagement/Search', data);
        };

        // 查看运营平台终端管理详情-UI
        this.GetByID = function (data) {
            return this.get('/Terminal/api/V1/TerminalManagement/GetByID', data);
        };

        // 查看运营平台终端管理出厂信息—UI
        this.FactoryVersion = function (data) {
            return this.get('/Terminal/api/V1/TerminalManagement/FactoryVersion', data);
        };
//{actions}
    }

    tool.inheritPrototype(TerminalManagementService, BaseModule);

    return new TerminalManagementService();
});

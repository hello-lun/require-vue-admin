define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function TerminalAppService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 添加一个APP的版本
        this.Add = function (data) {
            return this.post('/Terminal/api/V1/TerminalApp/Add', data);
        };

        // 
        this.GetUsableVersionByAppType = function (data) {
            return this.get('/Terminal/api/V1/TerminalApp/GetUsableVersionByAppType', data);
        };

        // 获取特定类型的app版本列表-UI
        this.GetByTerminalAppType = function (data) {
            return this.get('/Terminal/api/V1/TerminalApp/GetByTerminalAppType', data);
        };

        // 获取应用版本详情
        this.GetByID = function (data) {
            return this.get('/Terminal/api/V1/TerminalApp/GetByID', data);
        };

        // 添加一个APP的版本
        this.Edit = function (data) {
            return this.put('/Terminal/api/V1/TerminalApp/Edit', data);
        };

        // 删除APP
        this.Delete = function (data) {
            return this.delete('/Terminal/api/V1/TerminalApp/Delete', data);
        };

        // 
        this.Search = function (data) {
            return this.get('/Terminal/api/V1/TerminalApp/Search', data);
        };
//{actions}
    }

    tool.inheritPrototype(TerminalAppService, BaseModule);

    return new TerminalAppService();
});

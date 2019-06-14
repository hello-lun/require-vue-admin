define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function TerminalAPPTypeService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取终端类型列表
        this.GetAll = function (data) {
            return this.get('/Terminal/api/V1/TerminalAPPType/GetAll', data);
        };

        // 创建终端APP类型-UI
        this.Create = function (data) {
            return this.post('/Terminal/api/V1/TerminalAPPType/Create', data);
        };

        // 修改终端APP类型信息-UI
        this.Edit = function (data) {
            return this.put('/Terminal/api/V1/TerminalAPPType/Edit', data);
        };

        // 删除终端APP类型-UI
        this.Delete = function (data) {
            return this.delete('/Terminal/api/V1/TerminalAPPType/Delete', data);
        };

        // 删除终端类型
        this.GetByID = function (data) {
            return this.get('/Terminal/api/V1/TerminalAPPType/GetByID', data);
        };

        // 获取终端类型列表
        this.Search = function (data) {
            return this.get('/Terminal/api/V1/TerminalAPPType/Search', data);
        };
//{actions}
    }

    tool.inheritPrototype(TerminalAPPTypeService, BaseModule);

    return new TerminalAPPTypeService();
});

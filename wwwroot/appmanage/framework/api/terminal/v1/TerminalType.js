define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function TerminalTypeService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取终端类型列表
        this.GetTerminalTypes = function (data) {
            return this.get('/Terminal/api/V1/TerminalType/GetTerminalTypes', data);
        };

        // 创建终端类型
        this.CreateTerminalType = function (data) {
            return this.post('/Terminal/api/V1/TerminalType/CreateTerminalType', data);
        };

        // 修改终端类型信息
        this.EditTerminalType = function (data) {
            return this.put('/Terminal/api/V1/TerminalType/EditTerminalType', data);
        };

        // 删除终端类型
        this.DeleteTerminalType = function (data) {
            return this.delete('/Terminal/api/V1/TerminalType/DeleteTerminalType', data);
        };

        // 删除终端类型
        this.GetByID = function (data) {
            return this.get('/Terminal/api/V1/TerminalType/GetByID', data);
        };
//{actions}
    }

    tool.inheritPrototype(TerminalTypeService, BaseModule);

    return new TerminalTypeService();
});

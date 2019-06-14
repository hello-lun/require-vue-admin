define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function TerminalService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 创建新的终端
        this.CreateTerminal = function (data) {
            return this.post('/Terminal/api/V1/Terminal/CreateTerminal', data);
        };

        // 根据终端ID获取基本信息
        this.GetById = function (data) {
            return this.get('/Terminal/api/V1/Terminal/GetById', data);
        };

        // 修改终端信息
        this.EditTerminal = function (data) {
            return this.put('/Terminal/api/V1/Terminal/EditTerminal', data);
        };

        // 删除终端
        this.DeleteTerminal = function (data) {
            return this.delete('/Terminal/api/V1/Terminal/DeleteTerminal', data);
        };

        // 根据条件查询终端列表
        this.GetByCondition = function (data) {
            return this.get('/Terminal/api/V1/Terminal/GetByCondition', data);
        };
//{actions}
    }

    tool.inheritPrototype(TerminalService, BaseModule);

    return new TerminalService();
});

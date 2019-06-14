define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function DeviceService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 带分页列表
        this.List = function (data) {
            return this.get('/operation/api/v1/Device/List', data);
        };
        
        // 详情
        this.Detail = function (data) {
            return this.get('/operation/api/v1/Device/Detail', data);
        };

        // 运行日志
        this.RunLog = function (data) {
            return this.get('/operation/api/v1/Device/RunLog', data);
        };

        // 停用
        this.Off = function (data) {
            return this.put('/operation/api/v1/Device/Off', data);
        };

        this.Unbind = function (data) {
            return this.get('/operation/api/v1/Device/Unbind', data);
        };

        // 启用
        this.On = function (data) {
            return this.get('/operation/api/v1/Device/On', data);
        };
//{actions}
    }

    tool.inheritPrototype(DeviceService, BaseModule);

    return new DeviceService();
});

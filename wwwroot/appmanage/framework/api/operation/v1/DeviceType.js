define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function DeviceTypeService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取设备类型下拉列表
        this.List = function (data) {
            return this.get('/operation/api/v1/DeviceType/List', data);
        };

        // 版本适用设备类型
        this.Add = function (data) {
            return this.post('/operation/api/v1/DeviceType/Add', data);
        };
//{actions}
    }

    tool.inheritPrototype(DeviceTypeService, BaseModule);

    return new DeviceTypeService();
});

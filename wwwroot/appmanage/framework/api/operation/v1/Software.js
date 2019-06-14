define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function SoftwareService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增软件版本
        this.Add = function (data) {
            return this.post('/operation/api/v1/Software/Add', data);
        };

        // 带分页的软件管理列表
        this.List = function (data) {
            return this.get('/operation/api/v1/Software/List', data);
        };

        // 软件版本管理详情
        this.Detail = function (data) {
            return this.get('/operation/api/v1/Software/Detail', data);
        };

        // 已更新设备
        this.UpdatedList = function (data) {
            return this.get('/operation/api/v1/Software/UpdatedList', data);
        };

        // 推送更新
        this.Push = function (data) {
            return this.put('/operation/api/v1/Software/Push', data);
        };

        // 
        this.DetailInfo = function (data) {
            return this.get('/operation/api/v1/Software/DetailInfo', data);
        };
//{actions}
    }

    tool.inheritPrototype(SoftwareService, BaseModule);

    return new SoftwareService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function AssetsService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 资源包下拉列表
        this.Dropdown = function (data) {
            return this.get('/operation/api/v1/Assets/Dropdown', data);
        };

        // 新增资源包
        this.Add = function (data) {
            return this.post('/operation/api/v1/Assets/Add', data);
        };

        // 带分页的资源包列表
        this.List = function (data) {
            return this.get('/operation/api/v1/Assets/List', data);
        };

        // 详情
        this.Detail = function (data) {
            return this.get('/operation/api/v1/Assets/Detail', data);
        };

        // 已更新设备列表
        this.UpdatedList = function (data) {
            return this.get('/operation/api/v1/Assets/UpdatedList', data);
        };

        // 推送更新
        this.Push = function (data) {
            return this.put('/operation/api/v1/Assets/Push', data);
        };
//{actions}
    }

    tool.inheritPrototype(AssetsService, BaseModule);

    return new AssetsService();
});

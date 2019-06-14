define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function FirmwareService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取固件列表
        this.List = function (data) {
            return this.get('/operation/api/v1/Firmware/List', data);
        };

        // 新增固件
        this.Add = function (data) {
            return this.post('/operation/api/v1/Firmware/Add', data);
        };

        // 固件详情
        this.Detail = function (data) {
            return this.get('/operation/api/v1/Firmware/Detail', data);
        };

        // 版本已更新的设备列表
        this.UpdatedList = function (data) {
            return this.get('/operation/api/v1/Firmware/UpdatedList', data);
        };

        // 推送更新
        this.Push = function (data) {
            return this.put('/operation/api/v1/Firmware/Push', data);
        };

        // 下拉列表
        this.Dropdown = function (data) {
            return this.get('/operation/api/v1/Firmware/Dropdown', data);
        };

        // 根据id获取安装包详情
        this.DetailInfo = function (data) {
            return this.get('/operation/api/v1/Firmware/DetailInfo', data);
        };

        // 
        this.DataList = function (data) {
            return this.get('/operation/api/v1/Firmware/DataList', data);
        };

        // 
        this.PushUpdate = function (data) {
            return this.post('/operation/api/v1/Firmware/PushUpdate', data);
        };

        // 
        this.AlreadySelectID = function (data) {
            return this.get('/operation/api/v1/Firmware/AlreadySelectID', data);
        };

        this.SearchSingleMachine = function (data) {
            return this.post('/operation/api/v1/Firmware/SearchSingleMachine', data);
        };
        
        this.UpdateSingleMachine = function (data) {
            return this.post('/operation/api/v1/Firmware/UpdateSingleMachine', data);
        };


//{actions}
    }

    tool.inheritPrototype(FirmwareService, BaseModule);

    return new FirmwareService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function ModuleManage () {
        var baseUrl = '/api/module';
        BaseModule.call(this, baseUrl);

        this.getTypes = function (data) {
            return this.get('/GetTypes', data);
        };

        this.create = function (data) {
            return this.post('/Create', data);
        };

        this.getById = function (data) {
            return this.get('/getbyid', data);
        };

        this.update = function (data) {
            return this.put('/update', data);
        };

        this.setStoreModule = function (data) {
            return this.put('/SetStoreModule', data);
        };

        this.cancelStoreModule = function (data) {
            return this.put('/CancelStoreModule', data);
        };

        this.getAllByStoreId = function (data) {
            return this.put('/getallbystoreId', data);
        };

        this.getmoduleList = function (data) {
            return this.get('/getmoduleList',data);
        }

    }

    tool.inheritPrototype(ModuleManage, BaseModule);

    return new ModuleManage();
});
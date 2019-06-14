define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function StoreManage () {
        var baseUrl = 'mall/api/store';
        BaseModule.call(this, baseUrl);

        this.create = function (data) {
            return this.post('/Create', data);
        };

        this.getById = function (data) {
            return this.get('/GetByID', data);
        };

        this.update = function (data) {
            return this.get('/update', data);
        };
    }

    tool.inheritPrototype(StoreManage, BaseModule);

    return new StoreManage();
});
define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function CustomerManage () {
        var baseUrl = 'customer/api/customer';
        BaseModule.call(this, baseUrl);

        this.create = function (data) {
            return this.post('/Create', data);
        };

        this.getByID = function (data) {
            return this.post('/GetByID', data);
        };

        this.update = function (data) {
            return this.post('/update', data);
        };

        this.delete = function (data) {
            return this.put('/delete', data);
        };

        this.querySelect = function (data) {
            return this.get('/queryselect', data);
        };

    }

    tool.inheritPrototype(CustomerManage, BaseModule);

    return new CustomerManage();
});
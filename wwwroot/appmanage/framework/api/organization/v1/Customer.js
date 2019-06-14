define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function CustomerService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 根据条件查询商户列表
        this.SeachCustomerList = function (data) {
            return this.get('/Organization/api/V1/Customer/SeachCustomerList', data);
        };

        // 根据ID获取商户信息
        this.GetCustomerByID = function (data) {
            return this.get('/Organization/api/V1/Customer/GetCustomerByID', data);
        };

        // 编辑商户信息
        this.EditCustomer = function (data) {
            return this.put('/Organization/api/V1/Customer/EditCustomer', data);
        };
//{actions}
    }

    tool.inheritPrototype(CustomerService, BaseModule);

    return new CustomerService();
});

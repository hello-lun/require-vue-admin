define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function CustomerService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增客户
        this.Create = function (data) {
            return this.post('/Customer/api/v1/Customer/Create', data);
        };

        // 删除客户
        this.Delete = function (data) {
            return this.delete('/Customer/api/v1/Customer/Delete', data);
        };

        // 查询客户
        this.Search = function (data) {
            return this.get('/Customer/api/v1/Customer/Search', data);
        };

        // 根据ID获取客户详细信息
        this.GetInfo = function (data) {
            return this.get('/Customer/api/v1/Customer/GetInfo', data);
        };

        // 编辑客户信息
        this.Edit = function (data) {
            return this.put('/Customer/api/v1/Customer/Edit', data);
        };

        // 根据客户编码获取客户名称
        this.GetCustomerByNumber = function (data) {
            return this.get('/Customer/api/v1/Customer/GetCustomerByNumber', data);
        };

        // 根据客户ID获取门店列表
        this.GetTenantListByCustomerID = function (data) {
            return this.get('/Customer/api/v1/Customer/GetTenantListByCustomerID', data);
        };

        this.GetAccountBaseInfo = function (data) {
            return this.get('/Customer/internal/v1/WeChat/GetAccountBaseInfo', data);
        };

        this.GetAuthUrl = function (data) {
            return this.get('/Customer/internal/v1/WeChat/GetAuthUrl', data);
        };

        this.GetTemplateList = function (data) {
            return this.get('/Customer/internal/v1/WeChat/GetTemplateList', data);
        };
//{actions}
    }

    tool.inheritPrototype(CustomerService, BaseModule);

    return new CustomerService();
});

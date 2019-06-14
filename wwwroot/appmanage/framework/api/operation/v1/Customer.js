define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function CustomerService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        //发布
        this.WeAppPublish = function (data) {
            return this.get('/operation/api/v1/Customer/WeAppPublish', data);
        };

        //取消
        this.CancelAudit = function (data) {
            return this.get('/operation/api/v1/Customer/CancelAudit', data);
        };

        // 回滚
        this.WeAppRollback = function (data) {
            return this.get('/operation/api/v1/Customer/WeAppRollback', data);
        };

        // 提交审核，不发布
        this.WeAppPublishReview = function (data) {
            return this.post('/operation/api/v1/Customer/WeAppPublishReview', data);
        };

        // 客户主体 - 列表
        this.ListByArea = function (data) {
            return this.get('/operation/api/v1/Customer/ListByArea', data);
        };

        // 带分页列表
        this.List = function (data) {
            return this.get('/operation/api/v1/Customer/List', data);
        };

        // 审核资料
        this.AuditData = function (data) {
            return this.get('/operation/api/v1/Customer/AuditData', data);
        };

        // 提交/修改审核资料
        this.Modify = function (data) {
            return this.put('/operation/api/v1/Customer/Modify', data);
        };

        // 新增
        this.Add = function (data) {
            return this.post('/operation/api/v1/Customer/Add', data);
        };

        this.GetAuthUrl = function (data) {
            return this.get('/operation/api/v1/Customer/GetAuthUrl', data);
        };

        this.GetTemplateList = function (data) {
            return this.get('/operation/api/v1/Customer/GetTemplateList', data);
        };

        this.GetAccountBaseInfo = function (data) {
            return this.get('/operation/api/v1/Customer/GetAccountBaseInfo', data);
        };

        this.GetAppInfo = function (data) {
            return this.get('/operation/api/v1/Customer/GetAppInfo', data);
        };

        this.BindAppTemplate = function (data) {
            return this.get('/operation/api/v1/Customer/BindAppTemplate', data);
        };

        this.SubmitAudit = function (data) {
            return this.post('/operation/api/v1/Customer/SubmitAudit', data);
        };

//{actions}
    }

    tool.inheritPrototype(CustomerService, BaseModule);

    return new CustomerService();
});

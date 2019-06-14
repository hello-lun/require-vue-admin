define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function AuditService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 审核列表
        this.List = function (data) {
            return this.get('/operation/api/v1/Audit/List', data);
        };

        // 详情
        this.Detail = function (data) {
            return this.get('/operation/api/v1/Audit/Detail', data);
        };

        // 提交
        this.WechatSubmit = function (data) {
            return this.put('/operation/api/v1/Audit/WechatSubmit', data);
        };

        // 微信审核通过
        this.WechatPass = function (data) {
            return this.put('/operation/api/v1/Audit/WechatPass', data);
        };

        // 审核 - 微信审核驳回
        this.WechatReject = function (data) {
            return this.put('/operation/api/v1/Audit/WechatReject', data);
        };

        // 主体审核通过
        this.CustomerPass = function (data) {
            return this.put('/operation/api/v1/Audit/CustomerPass', data);
        };

        // 主体审核驳回
        this.CustomerReject = function (data) {
            return this.put('/operation/api/v1/Audit/CustomerReject', data);
        };
//{actions}
    }

    tool.inheritPrototype(AuditService, BaseModule);

    return new AuditService();
});

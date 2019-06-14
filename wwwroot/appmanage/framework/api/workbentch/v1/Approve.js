define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function ApproveService () {
        var baseUrl = '/Workbranch/api/v1/Approve';
        BaseModule.call(this, baseUrl, true);

        // 执行审批
        this.ExamineApprove = function (data) {
            return this.post('/ExamineApprove', data);
        };

        // 驳回审批
        this.RefuseApprove = function (data) {
            return this.post('/RefuseApprove', data);
        };
//{actions}
    }

    tool.inheritPrototype(ApproveService, BaseModule);

    return new ApproveService();
});

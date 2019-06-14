define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function FeedbackService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 带分页列表
        this.List = function (data) {
            return this.get('/operation/api/v1/Feedback/List', data);
        };

        // 详情
        this.Detail = function (data) {
            return this.get('/operation/api/v1/Feedback/Detail', data);
        };

        // 将反馈状态改为已读
        this.Read = function (data) {
            return this.put('/operation/api/v1/Feedback/Read', data);
        };
//{actions}
    }

    tool.inheritPrototype(FeedbackService, BaseModule);

    return new FeedbackService();
});

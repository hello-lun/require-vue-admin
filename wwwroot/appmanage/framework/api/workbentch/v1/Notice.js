define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function NoticeService () {
        var baseUrl = '/Workbranch/api/v1/Notice';
        BaseModule.call(this, baseUrl, false);

        // 创建通知任务
        this.CreateNotice = function (data) {
            return this.post('/CreateNotice', data);
        };

        // 通知发送者由于某种原因需要撤回之前已发出的通知
        this.RevocationNotice = function (data) {
            return this.put('/RevocationNotice', data);
        };
//{actions}
    }

    tool.inheritPrototype(NoticeService, BaseModule);

    return new NoticeService();
});

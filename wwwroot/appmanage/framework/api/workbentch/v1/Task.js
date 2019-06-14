define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function TaskService () {
        var baseUrl = '/Workbranch/api/v1/Task';
        BaseModule.call(this, baseUrl, true);

        // 任务查询
        this.QueryTask = function (data) {
            return this.get('/QueryTask', data);
        };

        // 获取任务详情
        this.GetTaskDetail = function (data) {
            return this.get('/GetTaskDetail', data);
        };

        // 将该任务标记为已读
        this.ReadTask = function (data) {
            return this.put('/ReadTask', data);
        };

        // 用于任务面板上的未读任务的提示
        this.UnRead = function (data) {
            return this.get('/UnRead', data);
        };
//{actions}
    }

    tool.inheritPrototype(TaskService, BaseModule);

    return new TaskService();
});

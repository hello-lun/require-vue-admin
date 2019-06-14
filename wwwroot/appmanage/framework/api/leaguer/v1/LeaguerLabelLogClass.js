define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerLabelLogClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 会员新增关联标签
        this.AddLeaguerLabelLog = function (data) {
            return this.post('/Leaguer/internal/v1/LeaguerLabelLogClass/AddLeaguerLabelLog', data);
        };

        // 移除会员关联标签
        this.EditLeaguerLabelLog = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerLabelLogClass/EditLeaguerLabelLog', data);
        };

        // 根据ID获取标签
        this.GetLeaguerLabelLogByID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLabelLogClass/GetLeaguerLabelLogByID', data);
        };

        // 根据会员ID获取标签
        this.GetLeaguerLabelLogByLeaguerID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLabelLogClass/GetLeaguerLabelLogByLeaguerID', data);
        };

        // 根据标签获取会员关联标签集合
        this.GetLeaguerLabelLogByLableName = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLabelLogClass/GetLeaguerLabelLogByLableName', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerLabelLogClassService, BaseModule);

    return new LeaguerLabelLogClassService();
});

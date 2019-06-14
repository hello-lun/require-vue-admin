define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerLabelClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 新增标签
        this.AddLeaguerLabel = function (data) {
            return this.post('/Leaguer/internal/v1/LeaguerLabelClass/AddLeaguerLabel', data);
        };

        // 新增标签
        this.EditLeaguerLabel = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerLabelClass/EditLeaguerLabel', data);
        };

        // 删除会员标签
        this.DeleteLeaguerLabel = function (data) {
            return this.delete('/Leaguer/internal/v1/LeaguerLabelClass/DeleteLeaguerLabel', data);
        };

        // 根据ID获取标签
        this.GetLeaguerLabelByID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLabelClass/GetLeaguerLabelByID', data);
        };

        // 根据ID获取标签
        this.GetLeaguerLabelByLabelType = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLabelClass/GetLeaguerLabelByLabelType', data);
        };

        // 根据ID获取标签
        this.GetLeaguerLabelByCondition = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLabelClass/GetLeaguerLabelByCondition', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerLabelClassService, BaseModule);

    return new LeaguerLabelClassService();
});

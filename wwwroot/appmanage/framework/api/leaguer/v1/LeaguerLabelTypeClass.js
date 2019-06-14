define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerLabelTypeClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 新增标签类型
        this.AddLeaguerLabelType = function (data) {
            return this.post('/Leaguer/internal/v1/LeaguerLabelTypeClass/AddLeaguerLabelType', data);
        };

        // 编辑标签类型
        this.EditLeaguerLabelType = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerLabelTypeClass/EditLeaguerLabelType', data);
        };

        // 删除会员标签类型
        this.DeleteLeaguerLabelType = function (data) {
            return this.delete('/Leaguer/internal/v1/LeaguerLabelTypeClass/DeleteLeaguerLabelType', data);
        };

        // 根据ID获取标签类型
        this.GetLeaguerLabelTypeByID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLabelTypeClass/GetLeaguerLabelTypeByID', data);
        };

        // 根据条件获取标签类型集合（分页）
        this.GetLeaguerLabelTypeByCondition = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLabelTypeClass/GetLeaguerLabelTypeByCondition', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerLabelTypeClassService, BaseModule);

    return new LeaguerLabelTypeClassService();
});

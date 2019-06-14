define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerLevelClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 获取会员级别的树形菜单
        this.GetLeaguerLevelTree = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLevelClass/GetLeaguerLevelTree', data);
        };

        // 新增会员级别
        this.AddLeaguerLevel = function (data) {
            return this.post('/Leaguer/internal/v1/LeaguerLevelClass/AddLeaguerLevel', data);
        };

        // 编辑会员级别相关信息
        this.EditLeaguerLevel = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerLevelClass/EditLeaguerLevel', data);
        };

        // 删除会员级别相关信息
        this.DeleteLeaguerLevel = function (data) {
            return this.delete('/Leaguer/internal/v1/LeaguerLevelClass/DeleteLeaguerLevel', data);
        };

        // 根据会员级别ID获取该会员级别相关信息
        this.GetLeaguerLevelByID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLevelClass/GetLeaguerLevelByID', data);
        };

        // 可根据会员级别名称、会员级别编号、适用渠道、注册介质获取会员级别信息列表
        this.GetLeaguerLevelList = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLevelClass/GetLeaguerLevelList', data);
        };

        // 检查会员级别名称是否已存在
        this.CheckLeaguerLevelName = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLevelClass/CheckLeaguerLevelName', data);
        };

        // 启用、禁用会员级别
        this.ChangeLeaguerLevelIsEnable = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerLevelClass/ChangeLeaguerLevelIsEnable', data);
        };

        // 获取所有会员级别
        this.GetAllLeaguerLevelList = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerLevelClass/GetAllLeaguerLevelList', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerLevelClassService, BaseModule);

    return new LeaguerLevelClassService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 根据查询条件（会员级别、会员名称、手机号、身份证、入会时间、入会渠道、会员生日等）获取会员信息
        this.GetLeaguerByCondition = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerClass/GetLeaguerByCondition', data);
        };

        // 批量启用、禁用会员
        this.ChangeLeaguerIsEnable = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerClass/ChangeLeaguerIsEnable', data);
        };

        // 根据会员ID获取会员信息
        this.GetLeaguerByID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerClass/GetLeaguerByID', data);
        };

        // 根据会员ID获取会员级别信息
        this.GetLevelByLeaguerID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerClass/GetLevelByLeaguerID', data);
        };

        // 新增会员
        this.AddLeaguer = function (data) {
            return this.post('/Leaguer/internal/v1/LeaguerClass/AddLeaguer', data);
        };

        // 编辑会员
        this.EditLeaguer = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerClass/EditLeaguer', data);
        };

        // 删除会员
        this.DeleteLeaguer = function (data) {
            return this.delete('/Leaguer/internal/v1/LeaguerClass/DeleteLeaguer', data);
        };

        // 变更会员级别
        this.ChangeLeaguerLevel = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerClass/ChangeLeaguerLevel', data);
        };

        // 根据会员卡号获取会员
        this.GetLeaguerByLeaguerCode = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerClass/GetLeaguerByLeaguerCode', data);
        };

        // 根据会员级别获取会员信息集合
        this.GetLeaguerListByLevelID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerClass/GetLeaguerListByLevelID', data);
        };

        // 据身份证获取(单个)会员
        this.GetLeaguerByIdentityCard = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerClass/GetLeaguerByIdentityCard', data);
        };

        // 根据手机号获取(单个)会员
        this.GetLeaguerByPhone = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerClass/GetLeaguerByPhone', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerClassService, BaseModule);

    return new LeaguerClassService();
});

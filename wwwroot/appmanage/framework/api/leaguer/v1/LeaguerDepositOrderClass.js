define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerDepositOrderClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 新增会员押金单
        this.AddLeaguerDepositOrder = function (data) {
            return this.post('/Leaguer/internal/v1/LeaguerDepositOrderClass/AddLeaguerDepositOrder', data);
        };

        // 编辑押金单
        this.EditLeaguerDepositOrder = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerDepositOrderClass/EditLeaguerDepositOrder', data);
        };

        // 根据ID获取会员押金单
        this.GetLeaguerDepositOrderByID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerDepositOrderClass/GetLeaguerDepositOrderByID', data);
        };

        // 根据会员ID获取会员押金单
        this.GetLeaguerDepositOrderByLeaguerID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerDepositOrderClass/GetLeaguerDepositOrderByLeaguerID', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerDepositOrderClassService, BaseModule);

    return new LeaguerDepositOrderClassService();
});

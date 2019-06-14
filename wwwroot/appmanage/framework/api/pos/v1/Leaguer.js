define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取会员(读卡或手机号)
        this.GetLeaguer = function (data) {
            return this.get('/POS/api/v1/Leaguer/GetLeaguer', data);
        };

        // 获取会员(读卡或手机号)
        this.GetLeaguerAccountStore = function (data) {
            return this.get('/POS/api/v1/Leaguer/GetLeaguerAccountStore', data);
        };

        // 会员锁卡或解锁
        this.LeaguerLock = function (data) {
            return this.put('/POS/api/v1/Leaguer/LeaguerLock', data);
        };

        // 会员锁卡或解锁
        this.UpdateLeaguerInfo = function (data) {
            return this.put('/POS/api/v1/Leaguer/UpdateLeaguerInfo', data);
        };

        // 修改会员密码
        this.UpdateLeaguerPassWord = function (data) {
            return this.put('/POS/api/v1/Leaguer/UpdateLeaguerPassWord', data);
        };

        // 会员补卡
        this.FillCard = function (data) {
            return this.put('/POS/api/v1/Leaguer/FillCard', data);
        };

        // 会员注销
        this.LeaguerCancel = function (data) {
            return this.put('/POS/api/v1/Leaguer/LeaguerCancel', data);
        };

        // 获取套票变更记录
        this.GetLeaguerTickets = function (data) {
            return this.get('/POS/api/v1/Leaguer/GetLeaguerTickets', data);
        };

        // 获取储值变更记录
        this.GetVirtualCurrencyChangeLogs = function (data) {
            return this.get('/POS/api/v1/Leaguer/GetVirtualCurrencyChangeLogs', data);
        };

        // 取消会员变更记录
        this.CancelVirtualCurrencyChangeLog = function (data) {
            return this.put('/POS/api/v1/Leaguer/CancelVirtualCurrencyChangeLog', data);
        };

        // 会员入会
        this.LeaguerJoin = function (data) {
            return this.post('/POS/api/v1/Leaguer/LeaguerJoin', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerService, BaseModule);

    return new LeaguerService();
});

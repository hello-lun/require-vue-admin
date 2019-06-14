define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function TerminalBoardService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.GetTerminalBoardMonitorList = function (data) {
            return this.get('/GameProject/api/v1/TerminalBoard/GetTerminalBoardMonitorList', data);
        };

        // 获取今天收入图饼
        this.GetToday = function (data) {
            return this.get('/GameProject/api/v1/TerminalBoard/GetToday', data);
        };

        // 终端看板-入园会员
        this.GetJoinLeaguer = function (data) {
            return this.get('/GameProject/api/v1/TerminalBoard/GetJoinLeaguer', data);
        };

        // 终端看板-售币数
        this.GetSaleCoin = function (data) {
            return this.get('/GameProject/api/v1/TerminalBoard/GetSaleCoin', data);
        };

        // 终端看板-耗币数
        this.GetConsumeCoin = function (data) {
            return this.get('/GameProject/api/v1/TerminalBoard/GetConsumeCoin', data);
        };

        // 终端看板-网络渠道收入
        this.GetChannelIncome = function (data) {
            return this.get('/GameProject/api/v1/TerminalBoard/GetChannelIncome', data);
        };

        // 终端看板-售票张数
        this.GetSaleTicket = function (data) {
            return this.get('/GameProject/api/v1/TerminalBoard/GetSaleTicket', data);
        };

        // 获取终端看板列表-看板
        this.GetTerminalBoardList = function (data) {
            return this.get('/GameProject/api/v1/TerminalBoard/GetTerminalBoardList', data);
        };
//{actions}
    }

    tool.inheritPrototype(TerminalBoardService, BaseModule);

    return new TerminalBoardService();
});

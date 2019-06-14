define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function TicketService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 根据项目ID查询套票信息UI
        this.SearchByMachine = function (data) {
            return this.get('/Ticket/api/v1/Ticket/SearchByMachine', data);
        };

        // 获取票打印样式
        this.GetPrintTemp = function (data) {
            return this.get('/Ticket/api/v1/Ticket/GetPrintTemp', data);
        };

        // 新建票打印样式
        this.createTicketPrintStyle = function (data) {
            return this.post('/Ticket/api/v1/Ticket/createTicketPrintStyle', data);
        };

        // 根据ID获取票样式数据
        this.GetPrintStlyeByID = function (data) {
            return this.get('/Ticket/api/v1/Ticket/GetPrintStlyeByID', data);
        };

        // 更新票打印样式
        this.UpdatePrintStyle = function (data) {
            return this.put('/Ticket/api/v1/Ticket/UpdatePrintStyle', data);
        };

        // 获取样式列表（不包括打印样式JSON数据）
        this.GetPrintStyleList = function (data) {
            return this.get('/Ticket/api/v1/Ticket/GetPrintStyleList', data);
        };
//{actions}
    }

    tool.inheritPrototype(TicketService, BaseModule);

    return new TicketService();
});

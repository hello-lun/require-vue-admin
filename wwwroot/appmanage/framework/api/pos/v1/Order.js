define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function OrderService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取订单列表
        this.GetOrderList = function (data) {
            return this.get('/POS/api/v1/Order/GetOrderList', data);
        };

        // 根据订单ID获取订单项列表
        this.GetOrderItemList = function (data) {
            return this.get('/POS/api/v1/Order/GetOrderItemList', data);
        };

        // 订单项退货
        this.OrderItemReturn = function (data) {
            return this.post('/POS/api/v1/Order/OrderItemReturn', data);
        };

        // 获取订单详情
        this.GetOrder = function (data) {
            return this.get('/POS/api/v1/Order/GetOrder', data);
        };

        // 打印小票
        this.PrintBill = function (data) {
            return this.get('/POS/api/v1/Order/PrintBill', data);
        };
//{actions}
    }

    tool.inheritPrototype(OrderService, BaseModule);

    return new OrderService();
});

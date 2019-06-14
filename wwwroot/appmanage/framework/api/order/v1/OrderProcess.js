define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function OrderProcessService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 创建一个订单
        this.Create = function (data) {
            return this.post('/Order/api/v1/OrderProcess/Create', data);
        };

        // 完成订单
        this.CompleteOrder = function (data) {
            return this.put('/Order/api/v1/OrderProcess/CompleteOrder', data);
        };

        // 订单退货
        this.PartReturn = function (data) {
            return this.put('/Order/api/v1/OrderProcess/PartReturn', data);
        };

        // 取消订单
        this.CancelOrder = function (data) {
            return this.put('/Order/api/v1/OrderProcess/CancelOrder', data);
        };

        // 支付完成(每次支付后调用)
        this.PayComplete = function (data) {
            return this.post('/Order/api/v1/OrderProcess/PayComplete', data);
        };

        // 更新支付记录(更新快照)
        this.UpdatePayState = function (data) {
            return this.post('/Order/api/v1/OrderProcess/UpdatePayState', data);
        };
//{actions}
    }

    tool.inheritPrototype(OrderProcessService, BaseModule);

    return new OrderProcessService();
});

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
            return this.post('/Product/api/V1/OrderProcess/Create', data);
        };

        // 订单退货
        this.ReturnOrder = function (data) {
            return this.put('/Product/api/V1/OrderProcess/ReturnOrder', data);
        };

        // 完成订单
        this.CompleteOrder = function (data) {
            return this.put('/Product/api/V1/OrderProcess/CompleteOrder', data);
        };

        // 取消订单
        this.CancelOrder = function (data) {
            return this.put('/Product/api/V1/OrderProcess/CancelOrder', data);
        };
//{actions}
    }

    tool.inheritPrototype(OrderProcessService, BaseModule);

    return new OrderProcessService();
});

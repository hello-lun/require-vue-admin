define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function OrderQueryService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 根据订单ID查询订单详情
        this.Detail = function (data) {
            return this.get('/Product/api/V1/OrderQuery/Detail', data);
        };

        // 商品销售/兑换订单记录查询
        this.SearchSalesLog = function (data) {
            return this.get('/Product/api/V1/OrderQuery/SearchSalesLog', data);
        };

        // 商品售卖/兑换订单项记录查询
        this.SearchExchLog = function (data) {
            return this.get('/Product/api/V1/OrderQuery/SearchExchLog', data);
        };
//{actions}
    }

    tool.inheritPrototype(OrderQueryService, BaseModule);

    return new OrderQueryService();
});

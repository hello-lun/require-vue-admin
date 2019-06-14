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
            return this.get('/Order/api/v1/OrderQuery/Detail', data);
        };

        // 商品销售订单记录查询
        this.SearchSalesLog = function (data) {
            return this.get('/Order/api/v1/OrderQuery/SearchSalesLog', data);
        };

        // 商品兑换订单项记录查询
        this.SearchExchangeLog = function (data) {
            return this.get('/Order/api/v1/OrderQuery/SearchExchangeLog', data);
        };

        // 根据会员ID查询统计订单金额信息
        this.ByLgIDOrderStatistics = function (data) {
            return this.post('/Order/api/v1/OrderQuery/ByLgIDOrderStatistics', data);
        };

        // 查询订单列表
        this.GetOrderList = function (data) {
            return this.get('/Order/api/v1/OrderQuery/GetOrderList', data);
        };

        // 查询订单列表
        this.GetLeaguerOrderList = function (data) {
            return this.get('/Order/api/v1/OrderQuery/GetLeaguerOrderList', data);
        };
//{actions}
    }

    tool.inheritPrototype(OrderQueryService, BaseModule);

    return new OrderQueryService();
});

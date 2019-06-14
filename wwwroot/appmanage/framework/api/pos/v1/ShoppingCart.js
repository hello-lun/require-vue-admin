define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function ShoppingCartService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 计算购物车所有商品价格信息
        this.CalculationInfo = function (data) {
            return this.post('/POS/api/v1/ShoppingCart/CalculationInfo', data);
        };

        // 提交订单
        this.SaveOrder = function (data) {
            return this.post('/POS/api/v1/ShoppingCart/SaveOrder', data);
        };

        // 获取支付方式列表
        this.GetPayMethodList = function (data) {
            return this.get('/POS/api/v1/ShoppingCart/GetPayMethodList', data);
        };

        // 提交订单
        this.Pay = function (data) {
            return this.post('/POS/api/v1/ShoppingCart/Pay', data);
        };

        // 根据输入搜索商品列表
        this.GetGoods = function (data) {
            return this.get('/POS/api/v1/ShoppingCart/GetGoods', data);
        };
//{actions}
    }

    tool.inheritPrototype(ShoppingCartService, BaseModule);

    return new ShoppingCartService();
});

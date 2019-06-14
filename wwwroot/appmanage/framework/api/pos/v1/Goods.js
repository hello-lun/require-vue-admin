define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function GoodsService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取分组商品
        this.GetSaleGoods = function (data) {
            return this.get('/POS/api/v1/Goods/GetSaleGoods', data);
        };
//{actions}
    }

    tool.inheritPrototype(GoodsService, BaseModule);

    return new GoodsService();
});

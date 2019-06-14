define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function GoodsService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 商品信息修改分类
        this.EditGoodsClass = function (data) {
            return this.put('/Goods/api/v1/Goods/EditGoodsClass', data);
        };

        // 商品导入
        this.GoodsImport = function (data) {
            return this.post('/Goods/api/v1/Goods/GoodsImport', data);
        };

        // 根据商品分类查询商品
        this.SearchGoodsByClass = function (data) {
            return this.get('/Goods/api/v1/Goods/SearchGoodsByClass', data);
        };
//{actions}
    }

    tool.inheritPrototype(GoodsService, BaseModule);

    return new GoodsService();
});

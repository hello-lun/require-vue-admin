define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function GoodsAttributeService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.Add = function (data) {
            return this.post('/Goods/api/v1/GoodsAttribute/Add', data);
        };

        // 
        this.GetAttribute = function (data) {
            return this.get('/Goods/api/v1/GoodsAttribute/GetAttribute', data);
        };

        // 更新商品属性信息UI
        this.Edit = function (data) {
            return this.put('/Goods/api/v1/GoodsAttribute/Edit', data);
        };

        // 删除商品自定义属性UI
        this.Delete = function (data) {
            return this.delete('/Goods/api/v1/GoodsAttribute/Delete', data);
        };

        // 查询商品自定义属性UI
        this.Search = function (data) {
            return this.post('/Goods/api/v1/GoodsAttribute/Search', data);
        };

        // 根据分类查询自定义属性列表UI
        this.SearchByClass = function (data) {
            return this.get('/Goods/api/v1/GoodsAttribute/SearchByClass', data);
        };

        // 根据分类查自定义属性编辑信息
        this.GetInfoByClass = function (data) {
            return this.get('/Goods/api/v1/GoodsAttribute/GetInfoByClass', data);
        };
//{actions}
    }

    tool.inheritPrototype(GoodsAttributeService, BaseModule);

    return new GoodsAttributeService();
});

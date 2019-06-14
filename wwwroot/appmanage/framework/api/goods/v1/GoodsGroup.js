define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function GoodsGroupService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增商品分组/视图
        this.AddGoodsGroup = function (data) {
            return this.post('/Goods/api/v1/GoodsGroup/AddGoodsGroup', data);
        };

        // 编辑商品视图UI
        this.EditGoodsGroup = function (data) {
            return this.put('/Goods/api/v1/GoodsGroup/EditGoodsGroup', data);
        };

        // 删除分组/视图UI
        this.DeleteGoodsGroup = function (data) {
            return this.post('/Goods/api/v1/GoodsGroup/DeleteGoodsGroup', data);
        };

        // 商品加入分组UI
        this.JoinGoodsGrop = function (data) {
            return this.post('/Goods/api/v1/GoodsGroup/JoinGoodsGrop', data);
        };

        // 获取所有视图
        this.GetAllView = function (data) {
            return this.get('/Goods/api/v1/GoodsGroup/GetAllView', data);
        };

        // 根据视图获取分组及商品列表UI
        this.GetSaleGoods = function (data) {
            return this.get('/Goods/api/v1/GoodsGroup/GetSaleGoods', data);
        };

        // 修改分组商品颜色UI
        this.UpdateGoodsColor = function (data) {
            return this.put('/Goods/api/v1/GoodsGroup/UpdateGoodsColor', data);
        };

        // 商品加入分组
        this.GoodsShowOrderBy = function (data) {
            return this.put('/Goods/api/v1/GoodsGroup/GoodsShowOrderBy', data);
        };
//{actions}
    }

    tool.inheritPrototype(GoodsGroupService, BaseModule);

    return new GoodsGroupService();
});

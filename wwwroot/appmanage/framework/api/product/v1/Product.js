define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function ProductService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增商品
        this.Add = function (data) {
            return this.post('/Product/api/V1/Product/Add', data);
        };

        // 编辑商品基础属性
        this.Edit = function (data) {
            return this.put('/Product/api/V1/Product/Edit', data);
        };

        // 通过商品关键字查询商品
        this.GetByPage = function (data) {
            return this.get('/Product/api/V1/Product/GetByPage', data);
        };

        // 根据ID获取商品信息
        this.GetByID = function (data) {
            return this.get('/Product/api/V1/Product/GetByID', data);
        };

        // 商品修改记录
        this.SerachEditLog = function (data) {
            return this.get('/Product/api/V1/Product/SerachEditLog', data);
        };

        // 获取商品业务分类
        this.GetGoodsKind = function (data) {
            return this.get('/Product/api/v1/Product/GetGoodsKind', data);
        };

        // 删除商品
        this.Delete = function (data) {
            return this.delete('/Product/api/V1/Product/Delete', data);
        };

        // 根据ID获取商品信息简略
        this.GetInfoByID = function (data) {
            return this.get('/Product/api/V1/Product/GetInfoByID', data);
        };        
        
        // 促销添加商品查询列表UI
        this.SearchPromotionGoodsList = function (data) {
            return this.post('/Product/api/v1/Product/SearchPromotionGoodsList', data);
        };
//{actions}
    }

    tool.inheritPrototype(ProductService, BaseModule);

    return new ProductService();
});

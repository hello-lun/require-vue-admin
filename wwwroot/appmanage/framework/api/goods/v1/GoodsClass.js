define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function GoodsClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增商品分类UI
        this.Add = function (data) {
            return this.post('/Goods/api/v1/GoodsClass/Add', data);
        };

        // 编辑商品信息,如果更改了父节点信息,需要生成所有子节点的路径信息
        this.Edit = function (data) {
            return this.put('/Goods/api/v1/GoodsClass/Edit', data);
        };

        // 获取商品分类树UI
        this.GetTree = function (data) {
            return this.get('/Goods/api/v1/GoodsClass/GetTree', data);
        };

        // 删除商品分类,并将商品转移到另外的分类
        this.Delete = function (data) {
            return this.delete('/Goods/api/v1/GoodsClass/Delete', data);
        };

        // 获取分类详细UI
        this.GetInfo = function (data) {
            return this.get('/Goods/api/v1/GoodsClass/GetInfo', data);
        };

        // 获取商品分类下拉列表
        this.GoodsClassSelect = function (data) {
            return this.get('/Goods/api/v1/GoodsClass/GoodsClassSelect', data);
        };
//{actions}
    }

    tool.inheritPrototype(GoodsClassService, BaseModule);

    return new GoodsClassService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function PricePromotionClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.GetTree = function (data) {
            return this.get('/Price/api/v1/PricePromotionClass/GetTree', data);
        };

        // 修改促销活动分类
        this.UpdatePromotionClass = function (data) {
            return this.put('/Price/api/v1/PricePromotionClass/UpdatePromotionClass', data);
        };

        // 
        this.Delete = function (data) {
            return this.delete('/Price/api/v1/PricePromotionClass/Delete', data);
        };

        // 
        this.Add = function (data) {
            return this.post('/Price/api/v1/PricePromotionClass/Add', data);
        };

        // 新增分类并移动促销上级分类促销到新增分类
        this.HintAdd = function (data) {
            return this.post('/Price/api/v1/PricePromotionClass/HintAdd', data);
        };

        // 
        this.GetPromotionClass = function (data) {
            return this.get('/Price/api/v1/PricePromotionClass/GetPromotionClass', data);
        };
//{actions}
    }

    tool.inheritPrototype(PricePromotionClassService, BaseModule);

    return new PricePromotionClassService();
});

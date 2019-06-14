define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function PricePromotionService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.GetPromotionList = function (data) {
            return this.get('/Price/api/v1/PricePromotion/GetPromotionList', data);
        };

        // 促销
        this.PromotionAdd = function (data) {
            return this.post('/Price/api/v1/PricePromotion/PromotionAdd', data);
        };

        // 促销
        this.PromotionEdit = function (data) {
            return this.post('/Price/api/v1/PricePromotion/PromotionEdit', data);
        };

        // 促销
        this.PromotionDelete = function (data) {
            return this.post('/Price/api/v1/PricePromotion/PromotionDelete', data);
        };

        // 删除多个促销方案
        this.PromotionDeletes = function (data) {
            return this.post('/Price/api/v1/PricePromotion/PromotionDeleteByIDs', data);
        };

        // 促销
        this.GetPromotionPlan = function (data) {
            return this.get('/Price/api/v1/PricePromotion/GetPromotionPlan', data);
        };
//{actions}
    }

    tool.inheritPrototype(PricePromotionService, BaseModule);

    return new PricePromotionService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function PriceService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 售卖界面
        this.GetPriceList = function (data) {
            return this.get('/Price/api/v1/Price/GetPriceList', data);
        };

        // 
        this.CheckGoods = function (data) {
            return this.get('/Price/api/v1/Price/CheckGoods', data);
        };

        // 计算价格信息
        this.CalculationInfo = function (data) {
            return this.get('/Price/api/v1/Price/CalculationInfo', data);
        };

        // 
        this.GetGoodsPromotionList = function (data) {
            return this.get('/Price/api/v1/Price/GetGoodsPromotionList', data);
        };

        // 计算价格
        this.Calculation = function (data) {
            return this.get('/Price/api/v1/Price/Calculation', data);
        };

        // 
        this.GetGoodsPriceInfo = function (data) {
            return this.get('/Price/api/v1/Price/GetGoodsPriceInfo', data);
        };

        // 
        this.Delete = function (data) {
            return this.delete('/Price/api/v1/Price/Delete', data);
        };
//{actions}
    }

    tool.inheritPrototype(PriceService, BaseModule);

    return new PriceService();
});

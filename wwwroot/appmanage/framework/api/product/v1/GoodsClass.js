define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function GoodsClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 查询分类列表
        this.GetList = function (data) {
            return this.get('/Product/api/V1/GoodsClass/GetList', data);
        };
//{actions}
    }

    tool.inheritPrototype(GoodsClassService, BaseModule);

    return new GoodsClassService();
});

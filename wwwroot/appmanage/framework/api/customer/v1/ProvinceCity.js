define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function ProvinceCityService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取地区数据
        this.GetAll = function (data) {
            return this.get('/Customer/api/v1/ProvinceCity/GetAll', data);
        };
//{actions}
    }

    tool.inheritPrototype(ProvinceCityService, BaseModule);

    return new ProvinceCityService();
});

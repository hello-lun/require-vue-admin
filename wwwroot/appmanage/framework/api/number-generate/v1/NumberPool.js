define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function NumberPoolService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 
        this.Integral = function (data) {
            return this.get('/numbergen/api/v1/NumberPool/Integral', data);
        };

        // 
        this.String = function (data) {
            return this.get('/numbergen/api/v1/NumberPool/String', data);
        };
//{actions}
    }

    tool.inheritPrototype(NumberPoolService, BaseModule);

    return new NumberPoolService();
});

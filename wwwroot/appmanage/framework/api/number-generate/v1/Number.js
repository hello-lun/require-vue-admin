define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function NumberService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 
        this.General = function (data) {
            return this.get('/numbergen/api/v1/Number/General', data);
        };

        // 
        this.GenerateByType = function (data) {
            return this.get('/numbergen/api/v1/Number/GenerateByType', data);
        };
//{actions}
    }

    tool.inheritPrototype(NumberService, BaseModule);

    return new NumberService();
});

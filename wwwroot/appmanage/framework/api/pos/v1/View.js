define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function viewService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.getall = function (data) {
            return this.get('/POS/api/v1/view/getall', data);
        };
//{actions}
    }

    tool.inheritPrototype(viewService, BaseModule);

    return new viewService();
});

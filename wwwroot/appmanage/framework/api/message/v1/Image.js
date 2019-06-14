define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function ImageService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.LoginCode = function (data) {
            return this.get('/Message/api/v1/Image/LoginCode', data);
        };
//{actions}
    }

    tool.inheritPrototype(ImageService, BaseModule);

    return new ImageService();
});

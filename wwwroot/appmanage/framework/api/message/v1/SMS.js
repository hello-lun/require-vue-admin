define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function SMSService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.Send = function (data) {
            return this.get('/Message/api/v1/SMS/Send', data);
        };
//{actions}
    }

    tool.inheritPrototype(SMSService, BaseModule);

    return new SMSService();
});

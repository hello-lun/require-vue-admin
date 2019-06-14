define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function FunctionalAuth () {
        var baseUrl = location.origin +   '/organization/api/v1/FunctionalAuth';
        BaseModule.call(this, baseUrl);

        this.save = function (data) {
            return this.post('/SaveAuth', data);
        }

        this.syncSuperiorAuth = function (data) {
            return this.post('/SyncSuperiorAuth', data);
        }

        this.GetAuth = function (data) {
            return this.get('/GetAuth', data)
        }
    }

    tool.inheritPrototype(FunctionalAuth, BaseModule);

    return new FunctionalAuth();
});
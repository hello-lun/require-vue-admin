
define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function User () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl);

        this.getByDepartmentID = function (data) {
            return this.get('/organization/api/v1/User/GetByDepartmentID', data);
        }

        this.search = function (data) {
            return this.put('/organization/api/v1/User/Search', data);
        }

        this.delete = function (data) {
            return this.delete('/organization/api/v1/User/Delete', data);
        }
    }

    tool.inheritPrototype(User, BaseModule);

    return new User();
});
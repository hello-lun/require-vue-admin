define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function Department () {
        var baseUrl = location.origin +  '/organization/api/v1/Department';
        BaseModule.call(this, baseUrl);

        this.create = function (data) {
            return this.post('/Create', data);
        }

        this.getByID = function (data) {
            return this.get('/GetByID', data);
        }

        this.update = function (data) {
            return this.put('/Update', data);
        }

        this.delete = function (data) {
            return this.delete('/Delete', data);
        }

        this.GetChildDepartmentByParentID = function (data) {
            return this.get("GetChildDepartmentByParentID",data);
        }
    }

    tool.inheritPrototype(Department, BaseModule);

    return new Department();
});
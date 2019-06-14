define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function DepartmentService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增部门
        this.AddDepartment = function (data) {
            return this.post('/Organization/api/V1/Department/AddDepartment', data);
        };

        // 编辑部门
        this.EditDepartment = function (data) {
            return this.put('/Organization/api/V1/Department/EditDepartment', data);
        };

        // 根据ID获取部门
        this.GetDepartmentByID = function (data) {
            return this.get('/Organization/api/V1/Department/GetDepartmentByID', data);
        };

        // 获取部门上级组织树形结构UI
        this.GetDepartmentTree = function (data) {
            return this.get('/Organization/api/V1/Department/GetDepartmentTree', data);
        };

        // 删除部门
        this.DeleteDepartmentByID = function (data) {
            return this.post('/Organization/api/V1/Department/DeleteDepartmentByID', data);
        };
//{actions}
    }

    tool.inheritPrototype(DepartmentService, BaseModule);

    return new DepartmentService();
});

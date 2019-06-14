define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function EmployeeService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增员工
        this.AddEmployee = function (data) {
            return this.post('/Organization/api/V1/Employee/AddEmployee', data);
        };

        // 编辑员工
        this.EditEmployee = function (data) {
            return this.put('/Organization/api/V1/Employee/EditEmployee', data);
        };

        // 根据ID获取员工
        this.GetEmployeeByID = function (data) {
            return this.get('/Organization/api/V1/Employee/GetEmployeeByID', data);
        };

        // 根据条件查询员工
        this.SeachEmployeeList = function (data) {
            return this.get('/Organization/api/V1/Employee/SeachEmployeeList', data);
        };

        // 删除员工
        this.DeleteEmployee = function (data) {
            return this.post('/Organization/api/V1/Employee/DeleteEmployee', data);
        };

        // 根据当前门店所有员工集合UI
        this.GetAllEmployee = function (data) {
            return this.get('/Organization/api/V1/Employee/GetAllEmployee', data);
        };

        // 根据岗位ID获取岗位名称、状态及岗位人员
        this.GetPositionsByID = function (data) {
            return this.get('/Organization/api/V1/Employee/GetPositionsByID', data);
        };
//{actions}
    }

    tool.inheritPrototype(EmployeeService, BaseModule);

    return new EmployeeService();
});

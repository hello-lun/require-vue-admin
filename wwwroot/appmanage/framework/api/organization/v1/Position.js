define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function PositionService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增岗位
        this.AddPosition = function (data) {
            return this.post('/Organization/api/V1/Position/AddPosition', data);
        };

        // 编辑岗位
        this.EditPosition = function (data) {
            return this.put('/Organization/api/V1/Position/EditPosition', data);
        };

        // 根据ID获取岗位
        this.GetPositionByID = function (data) {
            return this.get('/Organization/api/V1/Position/GetPositionByID', data);
        };

        // 获取岗位上级组织树形结构
        this.GetPositionTree = function (data) {
            return this.get('/Organization/api/V1/Position/GetPositionTree', data);
        };

        // 删除岗位
        this.DeletePositionByID = function (data) {
            return this.post('/Organization/api/V1/Position/DeletePositionByID', data);
        };

        // 根据当前门店所有员工集合
        this.GetAllEmployee = function (data) {
            return this.get('/Organization/api/V1/Position/GetAllEmployee', data);
        };

        // 根据ID获取岗位
        this.GetALLPosition = function (data) {
            return this.get('/Organization/api/V1/Position/GetALLPosition', data);
        };
//{actions}
    }

    tool.inheritPrototype(PositionService, BaseModule);

    return new PositionService();
});

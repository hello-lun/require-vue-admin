define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function GameProjectTypeService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.GetTree = function (data) {
            return this.get('/GameProject/api/v1/GameProjectType/GetTree', data);
        };

        // 添加项目类型
        this.AddProjectType = function (data) {
            return this.post('/GameProject/api/v1/GameProjectType/AddProjectType', data);
        };

        // 删除项目类型
        this.DeleteProjectType = function (data) {
            return this.delete('/GameProject/api/v1/GameProjectType/DeleteProjectType', data);
        };

        // 编辑项目类型
        this.EditProjectType = function (data) {
            return this.put('/GameProject/api/v1/GameProjectType/EditProjectType', data);
        };

        // 根据ID获取项目类型
        this.GetProjectType = function (data) {
            return this.put('/GameProject/api/v1/GameProjectType/GetProjectType', data);
        };

        // 
        this.GetTreeData = function (data) {
            return this.get('/GameProject/api/v1/GameProjectType/GetTreeData', data);
        };
//{actions}
    }

    tool.inheritPrototype(GameProjectTypeService, BaseModule);

    return new GameProjectTypeService();
});

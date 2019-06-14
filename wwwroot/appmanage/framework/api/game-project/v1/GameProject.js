define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function GameProjectService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 
        this.GetProject = function (data) {
            return this.get('/GameProject/api/v1/GameProject/GetProject', data);
        };

        // 
        this.GetProjectList = function (data) {
            return this.get('/GameProject/api/v1/GameProject/GetProjectList', data);
        };

        // 新增项目
        this.Add = function (data) {
            return this.post('/GameProject/api/v1/GameProject/Add', data);
        };

        // 
        this.Edit = function (data) {
            return this.put('/GameProject/api/v1/GameProject/Edit', data);
        };

        // 
        this.Delete = function (data) {
            return this.delete('/GameProject/api/v1/GameProject/Delete', data);
        };

        // 
        this.GetProjectDataList = function (data) {
            return this.post('/GameProject/api/v1/GameProject/GetProjectDataList', data);
        };
//{actions}
    }

    tool.inheritPrototype(GameProjectService, BaseModule);

    return new GameProjectService();
});

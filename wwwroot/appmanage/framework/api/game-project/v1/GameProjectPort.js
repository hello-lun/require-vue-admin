define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function GameProjectPortService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 获取端口列表
        this.GetPortList = function (data) {
            return this.get('/GameProject/api/v1/GameProjectPort/GetPortList', data);
        };

        // 获取单个端口
        this.GetPort = function (data) {
            return this.get('/GameProject/api/v1/GameProjectPort/GetPort', data);
        };

        // 项目解绑单个端口
        this.Unbundling = function (data) {
            return this.post('/GameProject/api/v1/GameProjectPort/Unbundling', data);
        };

        // 获取所有卡头标识
        this.GetPortIDList = function (data) {
            return this.get('/GameProject/api/v1/GameProjectPort/GetPortIDList', data);
        };

        // 编辑单个端口
        this.EditPort = function (data) {
                return this.get('/GameProject/api/v1/GameProjectPort/EditPort', data);
        };
        
//{actions}
    }

    tool.inheritPrototype(GameProjectPortService, BaseModule);

    return new GameProjectPortService();
});

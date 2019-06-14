define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerLevelService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 修改会员级别
        this.UpdateLeaguerLevel = function (data) {
            return this.put('/POS/api/v1/LeaguerLevel/UpdateLeaguerLevel', data);
        };

        // 
        this.GetAllLevel = function (data) {
            return this.get('/POS/api/v1/LeaguerLevel/GetAllLevel', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerLevelService, BaseModule);

    return new LeaguerLevelService();
});

define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function LeaguerCardClassService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 会员卡
        this.AddLeaguerCard = function (data) {
            return this.post('/Leaguer/internal/v1/LeaguerCardClass/AddLeaguerCard', data);
        };

        // 会员卡
        this.EditLeaguerCard = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerCardClass/EditLeaguerCard', data);
        };

        // 删除会员卡
        this.DeleteLeaguerCard = function (data) {
            return this.delete('/Leaguer/internal/v1/LeaguerCardClass/DeleteLeaguerCard', data);
        };

        // 根据ID获取会员卡
        this.GetLeaguerCardByID = function (data) {
            return this.get('/Leaguer/internal/v1/LeaguerCardClass/GetLeaguerCardByID', data);
        };

        // 会员绑定会员卡
        this.LeaguerBindingCard = function (data) {
            return this.put('/Leaguer/internal/v1/LeaguerCardClass/LeaguerBindingCard', data);
        };
//{actions}
    }

    tool.inheritPrototype(LeaguerCardClassService, BaseModule);

    return new LeaguerCardClassService();
});

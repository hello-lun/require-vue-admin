define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function MemberInfoService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 根据查询条件（会员级别、会员名称、手机号、身份证、入会时间、入会渠道、会员生日等）获取会员信息
        this.GetMemberInfoByLevelID = function (data) {
            return this.get('/Member/api/V1/MemberInfo/GetMemberInfoByLevelID', data);
        };

        // 批量启用、禁用会员
        this.ChangeMemberIsEnable = function (data) {
            return this.put('/Member/api/V1/MemberInfo/ChangeMemberIsEnable', data);
        };

        // 根据会员ID获取会员信息
        this.GetMemberByID = function (data) {
            return this.get('/Member/api/V1/MemberInfo/GetMemberByID', data);
        };

        // 根据会员ID获取会员标签
        this.GetLeaguerLabelLogByLeaguerID = function (data) {
            return this.get('/Member/api/V1/MemberInfo/GetLeaguerLabelLogByLeaguerID', data);
        };
//{actions}
    }

    tool.inheritPrototype(MemberInfoService, BaseModule);

    return new MemberInfoService();
});

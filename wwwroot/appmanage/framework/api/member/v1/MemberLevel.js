define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function MemberLevelService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, false);

        // 获取会员级别的树形菜单
        this.GetMemberLevelTree = function (data) {
            return this.get('/Member/api/V1/MemberLevel/GetMemberLevelTree', data);
        };

        // 新增会员级别
        this.AddMemberLevel = function (data) {
            return this.post('/Member/api/V1/MemberLevel/AddMemberLevel', data);
        };

        // 编辑会员级别相关信息
        this.EditMemberLevel = function (data) {
            return this.put('/Member/api/V1/MemberLevel/EditMemberLevel', data);
        };

        // 删除会员级别相关信息
        this.DeleteMemberLevel = function (data) {
            return this.post('/Member/api/V1/MemberLevel/DeleteMemberLevel', data);
        };

        // 根据会员级别ID获取该会员级别相关信息
        this.GetMemberLevelByID = function (data) {
            return this.get('/Member/api/V1/MemberLevel/GetMemberLevelByID', data);
        };

        // 可根据会员级别名称、会员级别编号、适用渠道、注册介质获取会员级别信息列表
        this.GetMemberLevelList = function (data) {
            return this.get('/Member/api/V1/MemberLevel/GetMemberLevelList', data);
        };

        // 检查会员级别名称是否已存在
        this.CheckMemberLevelName = function (data) {
            return this.get('/Member/api/V1/MemberLevel/CheckMemberLevelName', data);
        };

        // 启用、禁用会员级别
        this.ChangeMemberLevelIsEnable = function (data) {
            return this.put('/Member/api/V1/MemberLevel/ChangeMemberLevelIsEnable', data);
        };
//{actions}
    }

    tool.inheritPrototype(MemberLevelService, BaseModule);

    return new MemberLevelService();
});

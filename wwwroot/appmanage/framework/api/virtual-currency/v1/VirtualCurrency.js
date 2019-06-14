define([
    'framework/util/tool',
    'framework/api/BaseModule'
], function(tool, BaseModule) {
    'use strict';
    
    function VirtualCurrencyService () {
        var baseUrl = '';
        BaseModule.call(this, baseUrl, true);

        // 新增虚拟币
        this.Add = function (data) {
            return this.post('/VirtualCurrency/api/V1/VirtualCurrency/Add', data);
        };

        // 修改虚拟币
        this.Edit = function (data) {
            return this.put('/VirtualCurrency/api/V1/VirtualCurrency/Edit', data);
        };

        // 删除虚拟币配置
        this.Delete = function (data) {
            return this.delete('/VirtualCurrency/api/V1/VirtualCurrency/Delete', data);
        };

        // 查询虚拟币
        this.Search = function (data) {
            return this.get('/VirtualCurrency/api/V1/VirtualCurrency/Search', data);
        };

        // 获取虚拟币详细
        this.GetInfo = function (data) {
            return this.get('/VirtualCurrency/api/V1/VirtualCurrency/GetInfo', data);
        };

        // 获取可刷卡虚拟货币UI
        this.GetRefCard = function (data) {
            return this.get('/VirtualCurrency/api/V1/VirtualCurrency/GetRefCard', data);
        };
//{actions}
    }

    tool.inheritPrototype(VirtualCurrencyService, BaseModule);

    return new VirtualCurrencyService();
});

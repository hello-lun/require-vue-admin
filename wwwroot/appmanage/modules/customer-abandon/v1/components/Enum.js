define([
], function() {
    return {
        moduleType: {
            Leaguer: '会员管理',
            Good: '商品管理',
            Stock: '仓储',
            Price: '价格管理',
            Order: '订单',
            Pos: '收银台',
            Pay: '支付',
            VirtualCurrency: '虚拟货币',
            GameProject: '游乐项目',
            Ticket: '票务管理',
            Finance: '财务管理',
            Customer: '客户管理',
            Organization: '组织管理',
            Identity: '身份认证',
            User: '用户',
            Terminal: '终端',
            Lot: '硬件物联',
            File: '文件',
            Workbranch: '工作台',
            Numbergen: '编号管理',
        },

        moduleChargeType: {
            Charge: '收费',
            Free: '免费',
            OnTrial: '试用'
        },
        
        moduleChargeCycle: {
            AYear: '一年',
            HalfAYear: '半年',
            OneMonth: '一个月',
            FifteenDays: '15天'
        },

        moduleState: {
            Published: '已发布',
            Deactivated: '已停用',
            NotOnLine: '未上线',
        },

        terminalType: {
            TranceGuard: '智能门禁',
            CardTerminal: '刷卡终端',
            PhysicalCoinTerminal: '实物币终端',
            CardTicketTerminal: '卡票类终端',
            TicketBreaker: '碎票机',
            CashierTerminal: '收银台',
            QueuingAdvertisingMachine: '排队广告机',
            EasilyProjector: '易投器',
        },

        terminalState: {
            Bindings: '已绑定',
            Unbound: '未绑定',
        },

        networkState: {
            Online: '在线',
            Offline: '离线'
        }
    }
});
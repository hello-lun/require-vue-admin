define([
    'api/pos/v1/Order'
], function(
    order
) {
    'use strict';
    
    return {
        name: 'Order',

        created: function () {
            this.asyncGetOrderList();
        },
        
        data: function () {
            var payTypeMap = [{
                text: '现金',
                value: 'Cash'
            }, {
                text: '微信扫码',
                value: 'WeChatScan',
            }, {
                text: '支付宝扫码',
                value: 'AlipayScan'
            }, {
                text: '混合支付',
                value: 'BlendPay'
            }];

            var orderStatusMap = [{
                text: '已完成',
                value: 'Completed'
            }, {
                text: '已取消',
                value: 'Cancel'
            }, {
                text: '已退款',
                value: 'Return'
            }];

            return {
                orderList: [],
                payType: payTypeMap,
                orderStatus: orderStatusMap,
                // 当前选中行的ID
                currentOrder: {}
            };
        },

        computed: {
            returnBtnStatus: function () {
                if (this.currentOrder.State === undefined) {
                    return true;
                }
                return ['Cancel', 'Return'].indexOf(this.currentOrder.State) > -1;
            }
        },

        methods: {
            asyncGetOrderList: function () {
                var self = this;
                order
                    .GetOrderList({
                        PageSize: 1000
                    })
                    .then(function (res) {
                        self.orderList = res.Data;
                    });
            },
            // 过滤支付类型
            filterPayType: function (value, row) {
                return row.PayType === value;
            },
            // 过滤订单状态
            filterOrderStatus: function (value, row) {
                return row.State === value;
            },

            handlePayTypeName: function (value) {
                var payInfo =  _.find(this.payType, function (item) {
                    return item.value === value;
                }) || {};

                return payInfo.text;
            },

            handleOrderStatusName: function (value) {
                var orderStatusInfo = _.find(this.orderStatus, function (item) {
                    return item.value === value;
                }) || {};

                return orderStatusInfo.text || '';
            },

            handleCurrentChange: function (val) {
                this.$set(this, 'currentOrder', val || {});
            },

            handleOrderReturn: function () {
                var self = this;

                order
                    .OrderItemReturn({ OrderID: this.currentOrder.ID })
                    .then(function () {
                        self.asyncGetOrderList();
                    });
            }
        },

        template: `
            <el-container>
                <el-main>
                
                    <el-table
                        :data="orderList"
                        row-key="ID"
                        height="400"
                        @current-change="handleCurrentChange"
                        highlight-current-row>

                        <ych-table-column-format
                            prop="OrderTime"
                            label="订单日期"
                            format-type="date">
                        </ych-table-column-format>

                        <el-table-column
                            prop="OrderNumber"
                            label="订单号">
                        </el-table-column>

                        <el-table-column
                            prop="LeaguerNumber"
                            label="会员号">
                        </el-table-column>

                        <el-table-column
                            prop="PayType"
                            label="支付方式"
                            :filters="payType"
                            :filter-method="filterPayType">

                            <template slot-scope="scope">
                                <span>
                                    {{ handlePayTypeName(scope.row.PayType) }}
                                </span>
                            </template>
                        </el-table-column>

                        <ych-table-column-format
                            prop="Money"
                            label="金额"
                            format-type="currency">
                        </ych-table-column-format>

                        <el-table-column
                            prop="State"
                            label="状态"
                            :filters="orderStatus"
                            :filter-method="filterOrderStatus">

                            <template slot-scope="scope">
                                <span>
                                    {{ handleOrderStatusName(scope.row.State) }}
                                </span>
                            </template>
                        </el-table-column>

                    </el-table>

                </el-main>

                <el-aside width="300px">
                    <el-button 
                        @click="handleOrderReturn"
                        style="width: 100%;"
                        type="danger"
                        :disabled="returnBtnStatus">
                        退货
                    </el-button>
                </el-aside>
            </el-container>
        `
    }
});
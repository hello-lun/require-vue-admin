define([
    'numeral',
    'mixins/pagination',
    'api/product/v1/OrderQuery',
    'components/cascader-goods-class/index',
    'components/goods-kind/index'
], function(
    numeral,
    pagination,
    orderQuery,
    cascaderGoodsClass,
    goodsKind
) {
    'use strict';
    
    return {
        name: 'GoodsExchangeRecordDialog',

        mixins: [pagination],

        components: {
            CascaderGoodsClass: cascaderGoodsClass,
            GoodsKind: goodsKind
        },

        props: {
            visible: {
                type: Boolean,
                default: false
            },

            goodsId: String,

            // 查询维度，goods、class
            type: {
                type: String,
                default: 'goods'
            }
        },

        created: function () {
            // 初始化分页混合更新方法
            this.paginationUpdateFn = this.asyncGetGoodsExchangeRecord;
        },

        data: function () {
            return {
                dataList: [],

                formData: {
                    OrderNo: null,
                    OrderDateStart: null,
                    OrderDateEnd: null,
                    Leaguer: null,
                    ExchValue: null,
                    Status: null,
                    Operator: null,

                    // 以下为 按分类查询字段
                    GoodsName: null,
                    GoodsKindName: null,
                    GoodsClassName: null
                },

                sumData: {
                },
                

                exchangeValue: {
                    Coin: '代币',
                    Lottery: '彩票',
                    Deposit: '预存款',
                    Points: '积分'
                }
            };
        },

        watch: {
            'visible': function (val) {
                val 
                    ? this.asyncGetGoodsExchangeRecord() 
                    : this.initDialog();
            }
        },

        computed: {
            localVisible: {
                get: function () {
                    return this.visible;
                },

                set: function (val) {
                    this.$emit('update:visible', val);
                    val || this.$emit('update:goods-id', null);
                }
            },

            orderDate: {
                get: function () {
                    return [this.formData.OrderDateStart, this.formData.OrderDateEnd];
                },

                set: function (val) {
                    val = val || [];

                    this.formData.OrderDateStart = val[0] || null;
                    this.formData.OrderDateEnd = val[1] || null;
                }
            }
        },

        methods: {
            asyncGetGoodsExchangeRecord: function () {
                var self = this;
                
                this.$nextTick(function () {
                    var submitData = self.handleSubmitData();

                    orderQuery
                        .SearchSalesLog(submitData)
                        .then(function (data) {
                            self.dataList = data.Data;
                            self.paginationTotal = data.Total;

                            self.sumData = _.pick(data, ['Count', 'TotleMoney', 'Discount', 'PaidMoney']);
                        });
                });
            },

            handleQueryEvent: function () {
                this.clearData();
                this.asyncGetGoodsExchangeRecord();
            },

            clearData: function () {
                this.$_pagination_init();
            },

            initDialog: function () {
                this.clearData();

                this.dataList = [];

                _.extend(self.formData, {
                    OrderNo: null,
                    OrderStartDate: null,
                    OrderEndDate: null,
                    Leaguer: null,
                    ExchValue: null,
                    Status: null,
                    Operator: null,

                    GoodsName: null,
                    GoodsKindName: null,
                    GoodsClassName: null
                });

                self.sumData = null;
            },

            handleSubmitData: function() {
                return _.extend(
                    {},
                    this.formData,
                    this.paginationInfo,
                    { 
                        GoodsID: this.goodsId,
                        GoodsClassID: _.concat([], (this.formData.GoodsClassID || [])).pop()
                    }
                );
            },

            handleSumColumn: function () {
                var data = this.sumData || {};
                return [
                    '合计',
                    '',
                    '',
                    '',
                    numeral(data.Count || 0).format('0,0'),
                    numeral(data.TotleMoney || 0).format('0,0'),
                    numeral(data.Discount || 0).format('0,0'),
                    numeral(data.PaidMoney || 0).format('0,0')
                ];
            }
        },

        template: `
            <el-dialog
                title="商品售卖记录"
                width="930px"
                :visible.sync="localVisible">
                <ych-report-container>
                    <ych-report-header 
                        slot="header"
                        :setting-toggle="false"
                        @query-click="handleQueryEvent">

                        <template v-if="type === 'class'">
                            <ych-form-item 
                                label="商品名称"
                                key="GoodsName"
                                prop="GoodsName">
                                <el-input  
                                    v-model="formData.GoodsName">
                                </el-input>
                            </ych-form-item>

                            <ych-form-item 
                                label="商品类型"
                                key="Kind"
                                prop="Kind">
                                <goods-kind v-model="formData.Kind">
                                </goods-kind>
                            </ych-form-item>

                            <ych-form-item 
                                label="商品分类"
                                key="GoodsClassID"
                                prop="GoodsClassID">
                                <cascader-goods-class v-model="formData.GoodsClassID">
                                </cascader-goods-class>
                            </ych-form-item>
                        </template>
                        

                        <ych-form-item 
                            label="兑换单号"
                            key="OrderNo"
                            prop="OrderNo">
                            <el-input  
                                v-model="formData.OrderNo">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="兑换日期"
                            key="OrderDate"
                            prop="OrderDate">
                            <el-date-picker
                                v-model="orderDate"
                                type="daterange">
                            </el-date-picker>
                        </ych-form-item>

                        <ych-form-item 
                            label="会员"
                            key="Leaguer"
                            prop="Leaguer">
                            <el-input  
                                v-model="formData.Leaguer">
                            </el-input>
                        </ych-form-item>
                        
                        <ych-form-item 
                            label="兑换储值"
                            key="ExchValue"
                            prop="ExchValue">
                            <el-select v-model="formData.ExchValue">
                                <el-option
                                    v-for="(value, key) in exchangeValue"
                                    :key="key"
                                    :label="value"
                                    :value="key">
                                </el-option>
                            </el-select>
                        </ych-form-item>
                        
                        <ych-form-item 
                            label="订单状态"
                            key="Name"
                            prop="Name">
                            <el-input  
                                v-model="formData.Status">
                            </el-input>
                        </ych-form-item>
                        
                        <ych-form-item 
                            label="操作人"
                            key="Operator"
                            prop="Operator">
                            <el-input  
                                v-model="formData.Operator">
                            </el-input>
                        </ych-form-item>

                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :data="dataList"
                        row-key="ID"
                        :column-controller="false"
                        :show-summary="true"
                        :summary-method="handleSumColumn"
                        :height="350">

                        <template v-if="type === 'class'">
                            <el-table-column
                                prop="GoodsName"
                                label="商品名称"
                                width="150"
                                sortable>
                            </el-table-column>

                            <el-table-column
                                prop="GoodsKindName"
                                label="商品类型"
                                width="100"
                                sortable>
                            </el-table-column>

                            <el-table-column
                                prop="GoodsClassName"
                                label="商品分类"
                                width="150"
                                sortable>
                            </el-table-column>
                        </template>

                        <el-table-column
                            prop="OrderNo"
                            label="兑换单号"
                            width="150"
                            sortable>
                        </el-table-column>

                        <ych-table-column-format
                            prop="OrderDate"
                            label="兑换日期"
                            format-type="date" sortable>
                        </ych-table-column-format>
                        
                        <el-table-column
                            prop="LeaguerInfo"
                            label="会员信息"
                            width="150" sortable>
                        </el-table-column>
                        
                        <el-table-column
                            prop="UseValue"
                            label="使用储值"
                            width="100" sortable>
                        </el-table-column>

                        <ych-table-column-format
                            prop="Count"
                            label="兑换数量"
                            width="100"
                            format-type="number" sortable>
                        </ych-table-column-format>
                        
                        <ych-table-column-format
                            prop="TotleMoney"
                            label="兑换总额"
                            width="100"
                            format-type="number" sortable>
                        </ych-table-column-format>
                        
                        <ych-table-column-format
                            prop="Discount"
                            label="享受折扣"
                            width="100"
                            format-type="number" sortable>
                        </ych-table-column-format>
                        
                        <ych-table-column-format
                            prop="PaidMoney"
                            label="实付总额"
                            width="100"
                            format-type="number" sortable>
                        </ych-table-column-format>

                        <el-table-column
                            prop="Status"
                            label="兑换状态"
                            width="100" sortable>
                        </el-table-column>

                        <el-table-column
                            prop="Operator"
                            label="操作人"
                            width="100">
                        </el-table-column>

                    </ych-table>

                    <ych-pagination
                        slot="footerRight"
                        @size-change="$_pagination_sizeChange"
                        @current-change="$_pagination_currentChange"
                        :current-page="paginationInfo.PageIndex"
                        :total="paginationTotal">
                    </ych-pagination>

                </ych-report-container>
            </el-dialog>
        `
    }
});
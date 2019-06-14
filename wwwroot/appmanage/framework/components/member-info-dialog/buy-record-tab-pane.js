define([
    'api/order/v1/OrderQuery',
    'framework/components/select-goods-kind/index',
], function(
    OrderQuery,
    selectGoodsKind
) {
    'use strict';

    return {
        name: 'BuyRecordTabPane',

        props: {
            id: String,

            isActive: {
                type: Boolean,
                default: false
            }
        },

        components: {
            SelectGoodsKind: selectGoodsKind
        },

        data: function () {
            return {
                formData: {
                    LeaguerID: '',
                    StartTime: '',
                    EndTime: '',
                    GoodsKind: '',
                    GoodsName: ''
                },

                dataList: [],

                pageInfo: {
                    PageIndex: 1,
                    PageSize: 20
                },

                order: {
                    Order: 'OrderTime',
                    OderAsc: false
                },

                total: 0,

                totalData: {
                    Amount: 0,
                    Money: 0
                }
            }
        },

        computed: {
            buyTime: {
                get: function () {
                    return [this.formData.StartTime, this.formData.EndTime];
                },

                set: function (val) {
                    val = val || [];
                    this.formData.StartTime = val[0];
                    this.formData.EndTime = val[1];
                }
            }
        },

        watch: {
            'id': {
                immediate: true,
                handler: function (val, oldVal) {
                    (val) && this.asyncGetBuyRecord();
                }
            },

            'isActive': {
                immediate: true,
                handler: function (val, oldVal) {
                    val && this.$forceUpdate();
                }
            }
        },

        methods: {
            asyncGetBuyRecord: function () {
                var self = this;
                
                this.$nextTick(function () {
                    this.formData.LeaguerID = this.id;
                    var submitData = _.extend(
                        {},
                        this.formData,
                        this.pageInfo,
                        this.order
                    );
                    OrderQuery
                        .GetLeaguerOrderList(submitData)
                        .then(function (data) {
                            self.dataList = data.Data;
                            self.total = data.Total;
                            self.pageInfo.PageIndex = data.PageIndex;
                            self.pageInfo.PageSize = data.PageSize;
                        });
                });
            },

            handleSizeChange: function (size) {
                this.pageInfo.PageSize = size;
                this.asyncGetBuyRecord();
            },

            handleCurrentChange: function (index) {
                this.pageInfo.Page = index;
                this.asyncGetBuyRecord();
            },


            handleSortChange: function (data) {
                this.order.Order = data.prop;
                this.order.OderAsc = data.order === 'ascending';
                this.asyncGetBuyRecord();
            },

            getSummary: function (param) {
                var summaryArray = ['','','','',],
                    totalArray = ['合计', this.totalData.Amount, this.totalData.Money];

                return _.concat(summaryArray, totalArray);
            },

            // 清空数据
            clearData: function () {
                _.extend(this.formData, {
                    LeaguerID: '',
                    StartTime: '',
                    EndTime: '',
                    GoodsKind: '',
                    GoodsName: ''
                });
                
                this.dataList = [];

                _.extend(this.pageInfo, {
                    PageIndex: 1,
                    PageSize: 20
                });
            },
        },

        template: `
            <ych-report-container>
                <ych-report-header 
                    :setting-toggle="false"
                    slot="header"
                    @query-click="asyncGetBuyRecord">

                    <ych-form-item  
                        label="购买时间" 
                        key="buyTime"
                        prop="buyTime">
                        <el-date-picker 
                            v-model="buyTime"
                            type="daterange">
                        </el-date-picker>
                    </ych-form-item >

                    <ych-form-item  
                        label="商品类型" 
                        key="GoodsKind"
                        prop="GoodsKind">

                        <select-goods-kind v-model="formData.GoodsKind">
                        </select-goods-kind>
                        
                    </ych-form-item >

                    <ych-form-item  
                        label="商品名称" 
                        key="GoodsName"
                        prop="GoodsName">
                        <el-input v-model="formData.GoodsName"></el-input>
                    </ych-form-item >
                    
                </ych-report-header>

                <ych-table
                    slot="main"
                    :data="dataList"
                    :column-controller="false"
                    :default-sort = "{prop: 'OrderTime', order: 'descending'}"
                    :show-summary="true"
                    :summary-method="getSummary"
                    @sort-change="handleSortChange"
                    :height="250">

                    <ych-table-column-format
                        prop="OrderTime"
                        label="购买时间"
                        format-type="date" sortable>
                    </ych-table-column-format>

                    <el-table-column
                        prop="OrderNumber"
                        label="订单号"
                        width="128" sortable>
                    </el-table-column>
                    
                    <el-table-column
                        prop="GoodsName"
                        label="商品名称"
                        width="110" sortable>
                    </el-table-column>
                    
                    <el-table-column
                        prop="GoodsKind"
                        label="商品类型"
                        width="110" sortable>
                    </el-table-column>

                    <ych-table-column-format
                        prop="Price"
                        label="单价"
                        format-type="currency" sortable>
                    </ych-table-column-format>

                    <ych-table-column-format
                        prop="Amount"
                        label="数量"
                        format-type="number" sortable>
                    </ych-table-column-format>

                    <ych-table-column-format
                        prop="Money"
                        label="金额小计"
                        format-type="currency" sortable>
                    </ych-table-column-format>
                    
                </ych-table>

                <ych-pagination
                    slot="footerRight"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo.PageIndex"
                    :total="total">
                </ych-pagination>
            </ych-report-container>
        `
    }
});
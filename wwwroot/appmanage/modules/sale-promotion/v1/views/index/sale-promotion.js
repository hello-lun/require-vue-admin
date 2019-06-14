define([
    'mixins/pagination',
    'modules/sale-promotion/v1/components/sidebar-sale-promotion-add/index',
    'framework/api/price/v1/PricePromotion'
], function (
    pagination,
    sidebarSalePromotionAdd,
    PricePromotionService
) {
    'use strict';

    // 操作列按钮
    var operationGroup = [{
            label: '编辑',
            value: 'edit'
        },
        {
            label: '删除',
            value: 'delete'
        },
        {
            label: '复制',
            value: 'copy'
        }
    ]

    return {
        name: 'SalePromotionList',

        components: {
            sidebarSalePromotionAdd: sidebarSalePromotionAdd
        },

        mixins: [pagination],

        created: function () {
            // 初始化分页混合更新方法
            this.paginationUpdateFn = this.asyncGetSalePromotion;

            this.asyncSalePromotion();
        },

        data: function () {
            return {
                columnOpration: operationGroup,

                dataList: [],

                formData: {
                    Name: '',
                    Number: '',
                    PromotionType: '',
                    SchemeState: '',
                    GoodsName: '',
                    PageIndex: 1,
                    PageSize: 20
                },

                order: {
                    Order: 'Number',
                    OderAsc: true
                },

                // 类型选择
                SalePromotionOptions: [{
                    label: '全部',
                    value: '',
                }, {
                    label: '限时折扣',
                    value: 'Discount'
                }, {
                    label: '满减促销',
                    value: 'FullCut'
                }, {
                    label: '赠品促销',
                    value: 'Giveaway'
                }, {
                    label: '限时限购',
                    value: 'Purchase'
                }],

                SchemeStateOptions: [{
                    label: '全部',
                    value: ''
                }, {
                    label: '未审核',
                    value: 'NotPass'
                }, {
                    label: '未开始',
                    value: 'NotStart'
                }, {
                    label: '进行中',
                    value: 'Going'
                }, {
                    label: '已结束',
                    value: 'Ending'
                }],

                tableHideColumn: [],
                selectedRowIds: []
            };
        },

        methods: {
            asyncSalePromotion: function () {
                var self = this;

                this.$nextTick(function () {
                    var submitData = self.handleSubmitData();
                    PricePromotionService.GetPromotionList(self.formData).then(function(data){
                        self.dataList = data.Data;
                    });
                });
            },

            addSalePromotion: function () {
                const self = this;
                
                this.sideBar({
                    title: '新增方案',
                    datas: {
                        promotionClassID: this.formData.PromotionClassID
                    },
                    modules: [{
                        component: sidebarSalePromotionAdd
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.$message({
                            message: '方案保存成功！',
                            type: 'success'
                        });
                        self.asyncSalePromotion();
                    }
                }).show();

            },

            deleteSalePromotion: function (data) {
                if (!data.ID && this.selectedRowIds.length === 0) {
                    this.$message({
                        message: '请先选择需要删除的方案',
                        type: 'warning'
                    })
                    return
                }

                var self = this;
                if (data.ID) {
                    PricePromotionService.PromotionDelete({ID : data.ID}).then(function(data){
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        self.asyncSalePromotion();
                    });
                } else {
                    PricePromotionService.PromotionDeletes({
                        IDs: this.selectedRowIds
                    }).then(function(data){
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        self.asyncSalePromotion();
                    });
                }
            },
            
            copySalePromotion: function () {
                console.log('copy sale promotion');
            },

            handleSubmitData: function () {
                return _.extend({},
                    this.formData,
                    this.paginationInfo,
                    this.order
                );
            },

            editSalePromotion: function (data) {
                const self = this;
                this.sideBar({
                    title: '编辑促销方案',
                    datas: {
                        id: data.ID
                    },
                    modules: [{
                        component: sidebarSalePromotionAdd
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.$message({
                            message: '方案修改成功！',
                            type: 'success'
                        });
                        self.asyncSalePromotion();
                    }
                }).show();
            },

            handleOperationColumn: function (name, data) {
                if(name == 'edit'){
                    this.editSalePromotion(data);
                }else if(name == 'delete'){
                    this.deleteSalePromotion(data);
                }
                else if(name == 'copy'){
                    this.copySalePromotion(data);
                }
            },

            handleConditionHided: function (prop) {
                this.formData[prop] = null;
            },
            
            handleSelectionChange: function (selectedRows) {
                this.selectedRowIds = selectedRows.map(row => {
                    return row.ID
                })
                console.log(this.selectedRowIds)
            },

            handleSortChange: function (data) {
                this.order.Order = data.prop;
                this.order.OderAsc = data.order === 'ascending';

            },

            resetPromotionClassID : function(PromotionClassID){
                this.initFormData();
                this.formData.PromotionClassID = PromotionClassID;
                this.asyncSalePromotion();
            },

            initFormData : function(){
                this.formData =_.extend(this.formData, {
                    Name: '',
                    Number: '',
                    PromotionType: '',
                    SchemeState: '',
                    GoodsName: ''
                });
            }
        },

        template: `
            <ych-report-container>
                <ych-report-header 
                    slot="header"
                    @hide-condition="handleConditionHided"
                    @query-click="asyncSalePromotion">

                    <ych-form-item
                        label="方案名称"
                        key="Name"
                        prop="Name">
                        <el-input 
                            v-model="formData.Name"></el-input>
                    </ych-form-item>

                    <ych-form-item
                        label="方案类型"
                        key="PromotionType"
                        prop="PromotionType">
                            <el-select 
                            v-model="formData.PromotionType" 
                            placeholder="请选择">
                                <el-option
                                    v-for="item in SalePromotionOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                    </ych-form-item>

                    <ych-form-item
                        label="方案状态"
                        key="SchemeState"
                        prop="SchemeState">
                        <el-select 
                        v-model="formData.SchemeState" 
                        placeholder="请选择">
                            <el-option
                                v-for="item in SchemeStateOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </ych-form-item>

                    <ych-form-item
                        label="方案编号"
                        key="Number"
                        prop="Number">
                        <el-input 
                            v-model="formData.Number"></el-input>
                    </ych-form-item>

                    <ych-form-item
                        label="商品名称"
                        key="GoodsName"
                        prop="GoodsName">
                        <el-input 
                            v-model="formData.GoodsName"></el-input>
                    </ych-form-item>

                </ych-report-header>

                <ych-table
                    slot="main"
                    :data="dataList"
                    row-key="ID"
                    :default-sort = "{prop: 'Number', order: 'ascending'}"
                    @selection-change="handleSelectionChange"
                    @sort-change="handleSortChange"
                    @hide-columns="tableHideColumn = arguments[0]">

                    <el-table-column
                        type="selection"
                        width="40">
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('Name') < 0"
                        prop="Name"
                        label="方案名称"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('Number') < 0"
                        prop="Number"
                        label="方案编号"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('PromotionType') < 0"
                        prop="PromotionType"
                        label="方案类型"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('SchemeState') < 0"
                        prop="SchemeState"
                        label="方案状态"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('ValidityTime') < 0"
                        prop="ValidityTime"
                        label="方案有效期"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('GoodsCount') < 0"
                        prop="GoodsCount"
                        label="活动商品"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('ChannelInfo') < 0"
                        prop="ChannelInfo"
                        label="适用渠道"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('CreateTime') < 0"
                        prop="CreateTime"
                        label="创建日期"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('LastUpdaterName') < 0"
                        prop="LastUpdaterName"
                        label="最后修改人"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('LastUpdateTime') < 0"
                        prop="LastUpdateTime"
                        label="最后修改日期"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('UseCount') < 0"
                        prop="UseCount"
                        label="累计使用次数"
                        min-width="150" >
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('PromotionMoney') < 0"
                        prop="PromotionMoney"
                        label="累计让利金额"
                        min-width="150" >
                    </el-table-column>

                    <ych-table-column-operation
                        @operation-click="handleOperationColumn"
                        :operation="columnOpration">
                    </ych-table-column-operation>

                </ych-table>

                <template slot="footerLeft">
                    <ych-button 
                        @click="addSalePromotion" 
                        type="primary">
                        新增
                    </ych-button>

                    <ych-button 
                        @click="deleteSalePromotion" 
                        type="primary">
                        删除
                    </ych-button>
                    
                    <ych-button 
                        @click="copySalePromotion" >
                        复制
                    </ych-button>

                </template>

                <ych-pagination
                    slot="footerRight"
                    @size-change="$_pagination_sizeChange"
                    @current-change="$_pagination_currentChange"
                    :current-page="paginationInfo.PageIndex"
                    :total="paginationTotal">
                </ych-pagination>

            </ych-report-container>
        `
    }
});
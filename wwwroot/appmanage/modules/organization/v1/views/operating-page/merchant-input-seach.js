define([
    'api/product/v1/GoodsClass',
    'api/goods/v1/GoodsClass',
    'components/cascader-goods-class/index',
    'goods/components/sidebar-goods-class-add',
    'goods/components/goods-sale-record-dialog',
    'goods/components/goods-exchange-record-dialog'
], function(
    goodsClass,
    atomGoodsClass,
    cascaderGoodsClass,
    sidebarGoodsClassAdd,
    goodsSaleRecordDialog,
    goodsExchangeRecordDialog
) {
    'use strict';

    // 操作列按钮
    var operationGroup = [
        {
            label: '编辑',
            value: 'edit'
        },
        {
            label: '删除',
            value: 'delete'
        }
    ]
    
    return {
        name: 'GoodsClassList',

        components: {
            CascaderGoodsClass: cascaderGoodsClass,
            GoodsSaleRecordDialog: goodsSaleRecordDialog,
            GoodsExchangeRecordDialog: goodsExchangeRecordDialog
        },

        created: function () {
            this.asyncGetGoodsClassList();
        },

        data: function () {
            return {
                columnOpration: operationGroup,

                formData: {
                    Name: '',
                    ClassNo: '',
                    RootID: [],
                    Statistics: ''
                },

                dataList: [],

                order: {
                    Order: '',
                    OderAsc: true
                },

                tableHideColumn: [],

                // 售卖记录弹窗
                saleRecordDialogVisible: false,
                // 兑换记录弹窗
                exchangeRecordDialogVisible: false,
                // 操作按钮选中商品ID
                operationGoodsId: ''
            };
        },

        methods: {
            // 获取商品分类列表
            asyncGetGoodsClassList: function () {
                var self = this;
                
                this.$nextTick(function () {
                    var submitData = self.handleSubmitData();

                    goodsClass
                        .GetList(submitData)
                        .then(function (data) {
                            self.dataList = data.Data;
                            // self.total = data.Total;
                        })
                });
                
            },

            updateData: function () {
                this.asyncGetGoodsClassList();
                this.$emit('update-class');
            },

            // 处理提交数据
            handleSubmitData: function () {
                var finalFormData = _.extend({}, this.formData),
                    statistics = finalFormData.Statistics || [];

                finalFormData.StatisticsStartDate = statistics[0];
                finalFormData.StatisticsEndDate = statistics[1];
                delete finalFormData.Statistics;

                finalFormData.RootID = (finalFormData.RootID || []).pop();

                return _.extend(
                    {},
                    finalFormData,
                    this.order
                );
            },

            handleSortChange: function (data) {
                this.order.Order = data.prop;
                this.order.OderAsc = data.order === 'ascending';
                this.asyncGetGoodsClassList();
            },

            addGoodsClass: function () {
                var self = this;
                this.sideBar({
                    title: '新增商品分类',
                    modules: [{
                      component: sidebarGoodsClassAdd
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.updateData();
                        self.$message({
                            message: '分类添加成功！',
                            type: 'success'
                        });
                    }
                }).show();
            },

            editGoodsClass: function (data){
                var self = this,
                    id = data.ID;

                this.sideBar({
                    title: '编辑商品分类',
                    datas: {
                        id: id
                    },
                    modules: [{
                        component: sidebarGoodsClassAdd
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.updateData();
                        self.$message({
                            message: '分类保存成功！',
                            type: 'success'
                        });
                    }
                }).show();
            },

            // 删除商品操作
            deleteGoodsClass: function (data) {
                var self = this;

                this.$confirm('确定删除商品分类？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    self.callGoodsClassDeleteApi(data.ID);
                }).catch(function () {});
            },

            // 调用删除商品接口
            callGoodsClassDeleteApi: function (data) {
                var self = this;
                atomGoodsClass
                    .Delete({ ID: data})
                    .then(function () {
                        self.$message({
                            message: '商品分类删除成功！',
                            type: 'success'
                        });
                        self.asyncGetGoodsClassList();
                    });
            },

            handleOperationColumn: function (name, data) {
                var fnMap = {
                    'edit': this.editGoodsClass,
                    'delete': this.deleteGoodsClass
                };

                var fn = fnMap[name];
                fn && fn(data);
            },

            handleConditionHided: function (prop) {
                this.formData[prop] = null;
            },

            handleOperationToggle: function (name, row) {
                var is = true;
                if (name === 'delete') {
                    is = (row.ProductCount || 0) <= 0;
                } 

                return is;
            },

            openSaleDialog: function (id) {
                this.operationGoodsId = id;
                this.saleRecordDialogVisible = true;
            },

            openExchangeDialog: function (id) {
                this.operationGoodsId = id;
                this.exchangeRecordDialogVisible = true;
            }
        },

        template: `
            <div>
                <goods-sale-record-dialog
                    type="class"
                    :goods-id.sync="operationGoodsId"
                    :visible.sync="saleRecordDialogVisible">
                </goods-sale-record-dialog>

                <goods-exchange-record-dialog
                    type="class"
                    :goods-id.sync="operationGoodsId"
                    :visible.sync="exchangeRecordDialogVisible">
                </goods-exchange-record-dialog>
                <ych-report-container>
                    <ych-report-header 
                        slot="header"
                        @hide-condition="handleConditionHided"
                        @query-click="asyncGetGoodsClassList">

                        <ych-form-item 
                            label="分类名称"
                            key="Name"
                            prop="Name">
                            <el-input v-model="formData.Name"></el-input>
                        </ych-form-item >

                        <ych-form-item  
                            label="分类编号" 
                            key="ClassNo"
                            prop="ClassNo">
                            <el-input v-model="formData.ClassNo"></el-input>
                        </ych-form-item >

                        <ych-form-item  
                            label="上级分类" 
                            key="RootID"
                            prop="RootID">
                            <cascader-goods-class 
                                v-model="formData.RootID">
                            </cascader-goods-class>
                        </ych-form-item >
                        
                        <ych-form-item  
                            label="数据统计日期" 
                            key="Statistics"
                            prop="Statistics">
                            <el-date-picker 
                                v-model="formData.Statistics"
                                type="daterange">
                            </el-date-picker>
                        </ych-form-item >

                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :data="dataList"
                        :default-sort = "{prop: 'Number', order: 'ascending'}"
                        @hide-columns="tableHideColumn = arguments[0]">

                        <ych-table-column-format
                            v-if="tableHideColumn.indexOf('Number') < 0"
                            prop="Number"
                            label="商户编码"
                            width="150"
                            format-type="link"
                            :link-click="editGoodsClass"
                            sortable>
                        </ych-table-column-format>
                        
                        <el-table-column
                            v-if="tableHideColumn.indexOf('Name') < 0"
                            prop="Name"
                            label="商户名称"
                            width="120" sortable>
                        </el-table-column>
                        
                        <el-table-column
                            v-if="tableHideColumn.indexOf('RootName') < 0"
                            prop="RootName"
                            label="营业状态"
                            width="120" sortable>
                        </el-table-column>

                        <el-table-column
                            v-if="tableHideColumn.indexOf('CustomAttributes') < 0"
                            prop="CustomAttributes"
                            label="可用自定义属性"
                            width="200" sortable>
                        </el-table-column>

                        <ych-table-column-format
                            v-if="tableHideColumn.indexOf('ProductCount') < 0"
                            prop="ProductCount"
                            label="商品数量"
                            format-type="number" sortable>
                        </ych-table-column-format>

                        <el-table-column
                            v-if="tableHideColumn.indexOf('SaleCount') < 0"
                            prop="SaleCount"
                            label="售卖数量"
                            align="right"
                            width="120" sortable>

                            <template slot-scope="scope">
                                <ych-button @click="openSaleDialog(scope.row.ID)" type="text">
                                    {{ scope.row.SaleCount | number }}
                                </ych-button>
                            </template>

                        </el-table-column>
                        
                        <el-table-column
                            v-if="tableHideColumn.indexOf('ExchangeCount') < 0"
                            prop="ExchangeCount"
                            label="兑换数量"
                            align="right"
                            width="120" sortable>

                            <template slot-scope="scope">
                                <ych-button @click="openExchangeDialog((scope.row.ID))" type="text">
                                    {{ scope.row.ExchangeCount | number }}
                                </ych-button>
                            </template>

                        </el-table-column>
                        
                        <ych-table-column-operation
                            @operation-click="handleOperationColumn"
                            :toggle="handleOperationToggle"
                            :operation="columnOpration">
                        </ych-table-column-operation>
                    </ych-table>

                    <template slot="footerLeft">
                        <ych-button 
                            @click="addGoodsClass" 
                            type="primary">
                            新增分类
                        </ych-button>

                        <!--ych-button 
                            @click="handleGoodsBatchDelete"
                            :disabled="multipleSelection.length <= 0">
                            删除商品
                        </ych-button-->
                        
                    </template>

                    <!--ych-pagination
                        slot="footerRight"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageInfo.PageIndex"
                        :total="total">
                    </ych-pagination-->
                </ych-report-container>
            </div>
        `
    }
});
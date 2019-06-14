define([
    'api/product/v1/Product',
    'api/goods/v1/Goods',
    'components/cascader-goods-class/index',
    'goods/components/sidebar-goods-add/index',
    'mixins/pagination',
    'goods/components/goods-sale-record-dialog',
    'goods/components/goods-exchange-record-dialog'
], function(
    product,
    goods,
    cascaderGoodsClass,
    sidebarGoodsAdd,
    pagination,
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
    ];
    
    return {
        name: 'GoodsList',
        components: {
            CascaderGoodsClass: cascaderGoodsClass,
            GoodsSaleRecordDialog: goodsSaleRecordDialog,
            GoodsExchangeRecordDialog: goodsExchangeRecordDialog
        },

        mixins: [pagination],

        created: function () {
            // 初始化分页混合更新方法
            this.paginationUpdateFn = this.asyncGetGoodsList;

            this.asyncGetGoodsKindSetting();
            this.asyncGetGoodsList();
        },

        data: function () {
            return {
                columnOpration: operationGroup,

                formData: {
                    Name: '',
                    Number: '',
                    BarCode: '',
                    Kind: '',
                    ClassID: '',
                    Statistics: null
                },

                dataList: [],

                order: {
                    Order: '',
                    OderAsc: false
                },

                // 新增商品选择类型弹窗
                dialogVisible: false,
                // 商品类型设置
                kindSetting: [],
                // 选中的行
                multipleSelection: [],
                // 修改商品分类弹窗开关
                goodsClassDialog: false,

                modifiedGoodsClass: [],

                // 售卖记录弹窗
                saleRecordDialogVisible: false,
                // 兑换记录弹窗
                exchangeRecordDialogVisible: false,
                // 操作按钮选中商品ID
                operationGoodsId: ''
            };
        },

        watch: {
            'goodsClassDialog': function (val) {
                val || (this.modifiedGoodsClass = [])
            }
        },

        computed: {
            // 判断修改商品分类弹窗是否能提交
            classCanBeSubmit: function () {
                return this.modifiedGoodsClass && this.modifiedGoodsClass.length > 0
            },

            kindDailogWidth: function () {
                return (this.kindSetting.length * 150 + 40) + 'px';
            }
        },

        methods: {
            // 获取商品列表
            asyncGetGoodsList: function () {
                var self = this;
                
                this.$nextTick(function () {
                    var submitData = self.handleSubmitData();

                    product
                        .GetByPage(submitData)
                        .then(function (data) {
                            self.dataList = data.Data;
                            self.paginationTotal = data.Total;
                        });
                });
            },
            // 处理提交数据
            handleSubmitData: function () {
                var finalFormData = _.extend({}, this.formData),
                    statistics = finalFormData.Statistics || [];

                finalFormData.StartDate = statistics[0];
                finalFormData.EndDate = statistics[1];
                delete finalFormData.Statistics;

                return _.extend(
                    {},
                    finalFormData,
                    this.paginationInfo,
                    this.order
                );
            },

            handleSortChange: function (data) {
                this.order.Order = data.prop;
                this.order.OderAsc = data.order === 'ascending';
                this.asyncGetGoodsList();
            },

            addGoods: function (data) {
                var self = this;

                var title = `新增${data.Name}`;

                this.sideBar({
                    title: title,
                    datas: {
                        setting: data
                    },
                    modules: [{
                      component: sidebarGoodsAdd
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.asyncGetGoodsList();
                    }
                }).show();
            },

            handleSelectKind: function (data) {
                this.dialogVisible = false;
                this.addGoods(data);
            },

            asyncGetGoodsKindSetting: function () {
                var self = this;

                product
                    .GetGoodsKind()
                    .then(function(data) {
                        self.kindSetting = data.Data;
                    });
            },

            editGoods: function (data){
                var self = this,
                    id = data.ID;

                this.sideBar({
                    title: '编辑商品',
                    datas: {
                        id: id
                    },
                    modules: [{
                      component: sidebarGoodsAdd
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function () {
                        self.asyncGetGoodsList();
                    }
                }).show();
            },

            // 删除商品操作
            deleteGoods: function (data) {
                var self = this;
                    // 保留代码，暂时不做批量删除
                    // dataIsArray = typeof data === 'array',
                    // submitData = dataIsArray ? data : [data.ID],
                    // msg = dataIsArray ? '确定删除选中商品？' : '确定删除商品？';

                this.$confirm('确定删除商品？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    self.callGoodsDeleteApi(data.ID);
                }).catch(function () {});
            },

            // 调用删除商品接口
            callGoodsDeleteApi: function (data) {
                var self = this;
                product
                    .Delete({ ID: data})
                    .then(function () {
                        self.$message({
                            message: '商品删除成功！',
                            type: 'success'
                        });
                        self.asyncGetGoodsList();
                    });
            },

            handleOperationColumn: function (name, data) {
                var fnMap = {
                    'edit': this.editGoods,
                    'delete': this.deleteGoods
                };

                var fn = fnMap[name];
                fn && fn(data);
            },

            handleConditionHided: function (prop) {
                this.formData[prop] = null;
            },

            handleSelectionChange: function (val) {
                this.multipleSelection = val;
            },

            handleGoodsBatchDelete: function () {
                var ids = this.mapMultipleSelectionItemID();

                this.deleteMemberLevel(ids);
                // 清空选中行
                this.multipleSelection = [];
            },

            // 提取选中商品ID
            mapMultipleSelectionItemID: function () {
                return _.map(this.multipleSelection, function (item) {
                    return item.ID;
                });
            },

            // 修改选中的商品分类
            handleModifyGoodsClass: function () {
                var self = this,
                    ids = this.mapMultipleSelectionItemID(),
                    classId = _.toArray(this.modifiedGoodsClass).pop();

                goods
                    .EditGoodsClass({
                        GoodsIDs: ids,
                        ClassID: classId
                    })
                    .then(function (data) {
                        self.goodsClassDialog = false;
                        self.$message({
                            message: '商品分类更新成功',
                            type: 'success'
                        });
                        self.asyncGetGoodsList();
                    })
            },

            openSaleDialog: function (id) {
                this.operationGoodsId = id;
                this.saleRecordDialogVisible = true;
            },

            openExchangeDialog: function (id) {
                this.operationGoodsId = id;
                this.exchangeRecordDialogVisible = true;
            },

            handleGoodsKindIcon: function (kindInfo) {
                var iconMap = {
                    'Normal': 'ych-icon-lingshoushangpin',
                    'TicketTimesCount': 'ych-icon-jicipiao',
                    'TicketTermRule': 'ych-icon-qixianpiao',
                    'PreDeposit': 'ych-icon-yucunkuan',
                    'Gold': 'ych-icon-jinbi',
                    'Token': 'ych-icon-daibi',
                    'Lottery': 'ych-icon-caipiao',
                    'Integral': 'ych-icon-jifen',
                    'Custom': 'ych-icon-qita',
                };

                var type = kindInfo.Kind;

                if (kindInfo.Kind === 'VirtualCurrency') {
                    type = kindInfo.VirtualGoodsConfig.VirtualCurrencyType;
                }

                return iconMap[type];
            }
        },

        template: `
            <div>
                <el-dialog
                    title="新增商品"
                    :width="kindDailogWidth"
                    :visible.sync="dialogVisible">
                    <el-row 
                        type="flex"
                        class="goods-info__dialog" 
                        :gutter="20">
                        <el-col 
                            v-for="item in kindSetting"
                            class="goods-info__dialog-col"
                            :key="item.ID"
                            @click.native="handleSelectKind(item)" 
                            :span="6">
                            
                            <ych-svg-icon :icon="handleGoodsKindIcon(item)">
                            </ych-svg-icon>
                            <center> {{ item.Name }}</center>
                        </el-col>
                    </el-row>
                </el-dialog>

                <el-dialog
                    title="修改商品分类"
                    width="500px"
                    :visible.sync="goodsClassDialog">
                    <ych-form labelWidth="9em">
                        <ych-form-item 
                            label="修改后的商品分类"
                            key="modifiedGoodsClass"
                            prop="modifiedGoodsClass" require>

                            <cascader-goods-class 
                                v-model="modifiedGoodsClass">
                            </cascader-goods-class>

                        </ych-form-item>
                    </ych-form>
                    
                    <span slot="footer">
                        <ych-button 
                            type="primary" 
                            @click="handleModifyGoodsClass"
                            :disabled="!classCanBeSubmit">
                            保 存
                        </ych-button>
                        <ych-button @click="goodsClassDialog = false">
                            取 消
                        </ych-button>
                    </span>
                </el-dialog>

                <goods-sale-record-dialog 
                    :goods-id.sync="operationGoodsId"
                    :visible.sync="saleRecordDialogVisible">
                </goods-sale-record-dialog>

                <goods-exchange-record-dialog
                    :goods-id.sync="operationGoodsId"
                    :visible.sync="exchangeRecordDialogVisible">
                </goods-exchange-record-dialog>

                <ych-report-container>
                    <ych-report-header 
                        slot="header"
                        @hide-condition="handleConditionHided"
                        @query-click="asyncGetGoodsList">

                        <ych-form-item 
                            label="商品名称"
                            key="Name"
                            prop="Name">
                            <el-input v-model="formData.Name"></el-input>
                        </ych-form-item >

                        <ych-form-item  
                            label="商品编号" 
                            key="Number"
                            prop="Number">
                            <el-input v-model="formData.Number"></el-input>
                        </ych-form-item >

                        <ych-form-item  
                            label="商品条码" 
                            key="BarCode"
                            prop="BarCode">
                            <el-input v-model="formData.BarCode"></el-input>
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
                        @sort-change=""
                        @selection-change="handleSelectionChange">

                        <el-table-column
                            type="selection"
                            width="30">
                        </el-table-column>

                        <el-table-column
                            prop="Name"
                            label="商品信息"
                            width="280">

                            <template slot-scope="scope">
                                
                                <el-row 
                                    class="goods-info__info-cell" 
                                    type="flex" 
                                    :gutter="20"
                                    align="center"
                                    justify="space-between">
                                    <el-col class="goods-info__img">
                                        <img width="80px" height="80px" :src="scope.row.ImageUrl">
                                    </el-col>
                                    <el-col>
                                        <p>{{ scope.row.Name }}</p>
                                        <div class="goods-info__info-cell-sub">
                                            <small>
                                                商品编号：{{ scope.row.Number }}
                                            </small>
                                            </br>
                                            <small>
                                                商品条码：{{ scope.row.BarCodes }}
                                            </small>
                                        </div>
                                    </el-col>
                                </el-row>
                                
                                <div>
                                    
                                </div>
                            </template>

                        </el-table-column>
                        
                        <el-table-column
                            prop="ClassPath"
                            label="商品分类"
                            width="100" sortable>
                        </el-table-column>
                        
                        <el-table-column
                            prop="Kind"
                            label="商品类型"
                            width="138" sortable>
                        </el-table-column>

                        <ych-table-column-format
                            prop="Price"
                            label="建议零售价"
                            width="130"
                            format-type="currency" sortable>
                        </ych-table-column-format>

                        <ych-table-column-format
                            prop="SellPrice"
                            label="售卖价格"
                            format-type="currency" sortable>
                        </ych-table-column-format>
                        
                        <el-table-column
                            prop="ExchangeInfo"
                            label="兑换信息"
                            width="150" sortable>

                            <template slot-scope="scope">
                                <p v-for="item in scope.row.ExchangeInfo" :key="item.Key">
                                    {{ item.Description }}
                                    :
                                    {{ item.Value }}
                                </p>
                            </template>

                        </el-table-column>

                        <ych-table-column-format
                            prop="SalesCount"
                            label="售卖数量"
                            width="120"
                            format-type="number" sortable>
                        </ych-table-column-format>

                        <ych-table-column-format
                            prop="ExchangeCount"
                            label="兑换数量"
                            width="120"
                            format-type="number" sortable>
                        </ych-table-column-format>
                        
                        <ych-table-column-operation
                            @operation-click="handleOperationColumn"
                            :operation="columnOpration">
                        </ych-table-column-operation>
                    </ych-table>

                    <template slot="footerLeft">
                        <ych-button 
                            @click="dialogVisible = true" 
                            type="primary">
                            新增商品
                        </ych-button>

                        <ych-button
                            @click="goodsClassDialog = true"
                            :disabled="multipleSelection.length <= 0">
                            调整商品分类
                        </ych-button>

                        <!--ych-button 
                            @click="handleGoodsBatchDelete"
                            :disabled="multipleSelection.length <= 0">
                            删除商品
                        </ych-button-->

                        <ych-button>
                            导入商品
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
            </div>
        `
    }
});
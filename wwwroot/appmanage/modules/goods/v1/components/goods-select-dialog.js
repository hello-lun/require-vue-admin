define([
    'mixins/pagination',
    'components/cascader-goods-class/index',
    'components/goods-kind/index',
    'framework/api/product/v1/Product'
], function(
    pagination,
    cascaderGoodsClass,
    goodsKind,
    ProductService
)  {
    'use strict';
    
    return {
        name: 'GoodsSelectDialog',

        mixins: [pagination],

        components: {
            CascaderGoodsClass: cascaderGoodsClass,
            GoodsKind: goodsKind
        },

        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },

        created: function () {
            // 初始化分页混合更新方法
            this.paginationUpdateFn = this.asyncGetGoods;
            this.initDialog();
        },

        watch: {
            'visible': function (val) {
                val 
                    ? this.asyncGetGoods()
                    : this.initDialog();
            }
        },

        data: function () {
            return {
                dataList:[],
                multipleSelection:[],
                GoodsClassID : [],

                formData: {
                    NoInGoodsIDs: [],
                    GoodsName: '',
                    GoodsCode: '',
                    GoodsClassID: '',
                    Kind: '',
                    Supplier: '',
                    PageIndex: 1,
                    PageSize: 20
                }
            };
        },

        computed: {
            localVisible: {
                get: function () {
                    return this.visible;
                },

                set: function (val) {
                    
                    this.$emit('update:visible', val);
                }
            },
        },

        methods: {
            asyncGetGoods:function(){
                var self = this;
                ProductService.SearchPromotionGoodsList(this.formData).then(function(data){
                    self.dataList = data.Data;
                });
            },

            handleQueryEvent: function () {
                this.asyncGetGoods();
            },


            clearData: function () {
                this.$_pagination_init();

                _.extend(this.formData,{
                    NoInGoodsIDs: [],
                    GoodsName: '',
                    GoodsCode: '',
                    GoodsClassID: '',
                    Kind: '',
                    Supplier: ''
                });
            },

            initDialog: function () {
                this.clearData();
            },

            handleSelectedData: function() {
                var selectedRow = _.concat([], this.multipleSelection);

                this.localVisible = false;

                this.$emit('submit', selectedRow);
            }
        },

        template: `
            <el-dialog
                title="添加商品"
                width="930px"
                :modal-append-to-body="false"
                :visible.sync="localVisible">
                <ych-report-container>
                    <ych-report-header 
                        slot="header"
                        :setting-toggle="false"
                        @query-click="handleQueryEvent">

                            <ych-form-item 
                                label="商品名称"
                                key="GoodsName"
                                prop="GoodsName">
                                <el-input  
                                    v-model="formData.GoodsName">
                                </el-input>
                            </ych-form-item>

                            <ych-form-item 
                                label="商品编码"
                                key="GoodsCode"
                                prop="GoodsCode">
                                <el-input  
                                    v-model="formData.GoodsCode">
                                </el-input>
                            </ych-form-item>

                            <ych-form-item 
                                label="商品分类"
                                key="GoodsClassID"
                                prop="GoodsClassID">
                                <cascader-goods-class v-model="GoodsClassID">
                                </cascader-goods-class>
                            </ych-form-item>

                            <ych-form-item 
                                label="商品类型"
                                key="Kind"
                                prop="Kind">
                                <goods-kind v-model="formData.Kind">
                                </goods-kind>
                            </ych-form-item>
                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :data="dataList"
                        row-key="ID"
                        :column-controller="false"
                        @selection-change="multipleSelection = arguments[0]"
                        :height="350">

                        <el-table-column
                            type="selection"
                            width="45">
                        </el-table-column>

                        <el-table-column
                            prop="Name"
                            label="商品名称">
                        </el-table-column>

                        <el-table-column
                            prop="Number"
                            label="商品编码">
                        </el-table-column>
                        
                        <el-table-column
                            prop="Kind"
                            label="商品分类">
                        </el-table-column>
                        
                        <el-table-column
                            prop="Price"
                            label="价格"
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

                <span slot="footer">
                    <ych-button 
                        @click="localVisible = false">
                        取 消
                    </ych-button>
                    <ych-button 
                        type="primary" 
                        @click="handleSelectedData">
                        确 定
                    </ych-button>
                </span>

            </el-dialog>
        `
    }
});
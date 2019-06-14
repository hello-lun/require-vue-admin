define([
    'mixins/pagination',
    'api/goods/v1/GoodsAttribute'
], function(
    pagination,
    goodsAttribute
) {
    'use strict';
    
    return {
        name: 'CustomAttrDialog',

        mixins: [pagination],

        props: {
            visible: {
                type: Boolean,
                default: false
            },

            selected: {
                type: Array,
                default: []
            }
        },

        created: function () {
            // 初始化分页混合更新方法
            this.paginationUpdateFn = this.asyncGetCustomAttr;
        },

        data: function () {
            return {
                dataList: [],

                formData: {
                    Name: '',
                    IsEnable: true
                },

                multipleSelection: [],

                loading: false
            };
        },

        watch: {
            'visible': function (val) {
                val 
                    ? this.asyncGetCustomAttr() 
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
                }
            },

            loadmoreBtnText: function () {
                return this.loading 
                        ? '加载中...' 
                        : this.loadmoreBtnDisabled 
                            ? '没有更多了' 
                            : '加载更多';
            },

            loadmoreBtnDisabled: function () {
                return this.paginationTotal <= this.dataList.length;
            }
        },

        methods: {
            asyncGetCustomAttr: function () {
                var self = this;

                var failFn = function () {
                    self.loading = false;
                    self.paginationInfo.PageIndex--;
                }
                
                this.$nextTick(function () {
                    var submitData = self.handleSubmitData();
                    self.loading = true;

                    goodsAttribute
                        .Search(submitData)
                        .then(function (data) {
                            self.loading = false;

                            _.forEach(data.Data, function (item) {
                                self.dataList.push(item);
                            });

                            self.paginationTotal = data.Total;
                        }, function () {
                            failFn();
                        })
                        .catch(function () {
                            failFn();
                        })
                });
            },

            handleQueryEvent: function () {
                this.clearData();
                this.asyncGetCustomAttr();
            },

            clearData: function () {
                this.dataList = [];
                this.multipleSelection = [];
                _.extend(this.paginationInfo, {
                    PageSize: 20,
                    PageIndex: 1
                });
                this.paginationTotal = 0;
            },

            initDialog: function () {
                this.clearData();
                this.formData.Name = '';
            },

            handleSubmitData: function() {
                return _.extend(
                    {},
                    this.formData,
                    this.paginationInfo,
                    { AttributeIDs: this.selected }
                );
            },

            loadmore: function () {
                var index = this.paginationInfo.PageIndex + 1;
                this.$_pagination_currentChange(index);
            },

            handleSelectedData: function () {
                var selectedRow = _.concat([], this.multipleSelection);

                this.localVisible = false;

                this.$emit('submit', selectedRow);
            }
        },

        template: `
            <el-dialog
                title="选择自定义属性"
                :visible.sync="localVisible"
                :lock-scroll="false"
                :modal-append-to-body="false">
                <ych-report-container>
                    <ych-report-header 
                        slot="header"
                        :setting-toggle="false"
                        @query-click="handleQueryEvent">

                        <ych-form-item 
                            key="Name"
                            prop="Name"
                            label="">
                            <el-input 
                                placeholder="输入属性名称进行搜索" 
                                v-model="formData.Name"></el-input>
                        </ych-form-item>

                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :data="dataList"
                        row-key="ID"
                        :column-controller="false"
                        @selection-change="multipleSelection = arguments[0]"
                        :height="350">

                        <el-button 
                            slot="append"
                            :loading="loading"
                            :disabled="loadmoreBtnDisabled"
                            type="info"
                            @click="loadmore"
                            style="width: 100%; border-radius:0;border: 0;"
                            plain>
                            {{ loadmoreBtnText }}
                        </el-button>

                        <el-table-column
                            prop="Name"
                            label="属性编号"
                            width="100">
                        </el-table-column>

                        <el-table-column
                            prop="Name"
                            label="属性名称"
                            width="120">
                        </el-table-column>
                        
                        <el-table-column
                            prop="RootName"
                            label="列表选项"
                            min-width="220" 
                            show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column
                            type="selection"
                            width="45">
                        </el-table-column>
                    </ych-table>

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
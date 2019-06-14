define([
    'mixins/pagination',
    'api/goods/v1/GoodsAttribute',
    'goods/components/sidebar-custom-attr-add'
], function(
    pagination,
    goodsAttribute,
    sidebarCustomAttrAdd
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
        name: 'GoodsCustomList',

        mixins: [pagination],

        created: function () {
            // 初始化分页混合更新方法
            this.paginationUpdateFn = this.asyncGetCustomAttr;

            this.asyncGetCustomAttr();
        },

        data: function () {
            return {
                columnOpration: operationGroup,

                dataList: [],

                formData: {
                    Name: '',
                    Number: '',
                    DisplayType: '',
                    IsEnable: ''
                },

                order: {
                    Order: 'Number',
                    OderAsc: true
                },

                // 类型选择
                typeOptions: [{
                    label: '全部',
                    value: '',
                }, {
                    label: '下拉列表',
                    value: 'Select'
                }, {
                    label: '文本框',
                    value: 'TextBox'
                }, {
                    label: '日期选择',
                    value: 'DateSelect'
                }],

                enableOptions: [{
                    label: '全部',
                    value: '',
                }, {
                    label: '是',
                    value: true
                }, {
                    label: '否',
                    value: false
                }],

                tableHideColumn: []
            };
        },

        methods: {
            asyncGetCustomAttr: function () {
                var self = this;
                
                this.$nextTick(function () {
                    var submitData = self.handleSubmitData();

                    goodsAttribute
                        .Search(submitData)
                        .then(function (res) {
                            self.dataList = res.Data;
                            self.paginationTotal = res.Total;
                        });
                });
            },

            handleSubmitData: function() {
                return _.extend(
                    {},
                    this.formData,
                    this.paginationInfo,
                    this.order
                );
            },

            // handleTypeLabel: function (type) {
            //     var map = {
            //         Select: '下拉列表',
            //         TextBox: '文本框',
            //         DateSelect: '日期选择框',
            //     };

            //     return map[type] || '-';
            // },

            editCustomAttr: function (data) {
                var self = this;
                this.sideBar({
                    title: '编辑商品自定义属性',
                    datas: {
                        id: data.ID
                    },
                    modules: [{
                      component: sidebarCustomAttrAdd
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.asyncGetCustomAttr();
                    }
                }).show();
            },

            addCustomAttr: function () {
                var self = this;
                this.sideBar({
                    title: '新增商品自定义属性',
                    modules: [{
                      component: sidebarCustomAttrAdd
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.asyncGetCustomAttr();
                    }
                }).show();
            },

            deleteCustomAttr: function (id) {
                var self = this;
                goodsAttribute
                    .Delete({ ID: id})
                    .then(function () {
                        self.$message({
                            message: '商品自定义属性删除成功！',
                            type: 'success'
                        });
                        self.asyncGetCustomAttr();
                    });
            },

            confirmDeleteCustomAttr: function (data) {
                var self = this;
                this.$confirm('确定删除商品自定义属性？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    self.deleteCustomAttr(data.ID);
                }).catch(function () {});
            },
            
            handleOperationColumn: function (name, data) {
                var fnMap = {
                    'edit': this.editCustomAttr,
                    'delete': this.confirmDeleteCustomAttr
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
                    is = row.IsDel;
                } 

                return is;
            },

            handleSortChange: function (data) {
                this.order.Order = data.prop;
                this.order.OderAsc = data.order === 'ascending';
                this.asyncGetCustomAttr();
            },
        },

        template: `
            <ych-report-container>
                <ych-report-header 
                    slot="header"
                    @hide-condition="handleConditionHided"
                    @query-click="asyncGetCustomAttr">

                    <ych-form-item
                        label="属性名称"
                        key="Name"
                        prop="Name">
                        <el-input 
                            v-model="formData.Name"></el-input>
                    </ych-form-item>

                    <ych-form-item
                        label="属性编号"
                        key="Number"
                        prop="Number">
                        <el-input 
                            v-model="formData.Number"></el-input>
                    </ych-form-item>

                    <ych-form-item
                        label="显示类型"
                        key="DisplayType"
                        prop="DisplayType">
                        <el-select 
                            v-model="formData.DisplayType" 
                            placeholder="请选择">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </ych-form-item>

                    <ych-form-item
                        label="是否启用"
                        key="IsEnable"
                        prop="IsEnable">
                        <el-select 
                            v-model="formData.IsEnable" 
                            placeholder="请选择">
                            <el-option
                                v-for="item in enableOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </ych-form-item>

                </ych-report-header>

                <ych-table
                    slot="main"
                    :data="dataList"
                    row-key="ID"
                    :default-sort = "{prop: 'Number', order: 'ascending'}"
                    @sort-change="handleSortChange"
                    @hide-columns="tableHideColumn = arguments[0]">

                    <el-table-column
                        type="selection"
                        width="40">
                    </el-table-column>

                    <ych-table-column-format
                        v-if="tableHideColumn.indexOf('Number') < 0"
                        prop="Number"
                        label="属性编号"
                        min-width="150"
                        :link-click="editCustomAttr"
                        format-type="link" sortable>
                    </ych-table-column-format>
                    
                    <el-table-column
                        v-if="tableHideColumn.indexOf('Name') < 0"
                        prop="Name"
                        label="属性名称"
                        min-width="150" 
                        sortable>
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('DisplayType') < 0"
                        prop="DisplayType"
                        label="显示类型"
                        min-width="150" 
                        sortable>
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('Option') < 0"
                        prop="Option"
                        label="列表选项"
                        min-width="300" 
                        show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('IsEnable') < 0"
                        prop="IsEnable"
                        label="是否启用"
                        min-width="100"
                        sortable>
                        <template slot-scope="scope">
                            {{ scope.row.IsEnable ? '是' : '否' }}
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
                        @click="addCustomAttr" 
                        type="primary">
                        新增属性
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
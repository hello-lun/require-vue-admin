define([
    'framework/mixins/sidebar-form',
    'api/customer/v1/Customer',
    'customer/views/store-admin/store-add'
], function(
    sideBarFormMixins,
    Customer,
    StoreAdd
) {
    'use strict';

    return {
        name: 'CustomerDetails',
        mixins: [sideBarFormMixins],

        created () {
            this.asyncGetCustomerInfo()
            this.asyncGetCustomerStoreList()
        },

        data: function () {
            return {
                customerData: {},
                customerStoreList: [],
                customerStorePageIndex: 1,
                customerStorePageSize: 20,
                customerStoreTotalSize: 0,

                columnOperation: [{
                    label: '查看详情',
                    value: 'details'
                }],

                isEdit: false
            }
        },

        computed: {
            customerId: function () {
                return this.incomingData.ID || ''
            }
        },

        methods: {
            save: function () {
                const _self = this
                if (!_self.isEdit) {
                    _self.$message({
                        message: '请首先执行编辑之后，执行保存',
                        type: 'warning'
                    })
                } else {
                    // 执行保存
                    if (_self.customerData.Tel && _self.customerData.Address) {
                        return new Promise((resolve, reject) => {
                            Customer.Edit(_self.customerData).then(function (res) {
                                _self.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                            })
                            resolve()
                        })
                    } else {
                        _self.$message({
                            message: '请输入必要参数后点击保存'
                        })
                    }

                }

                return Promise.reject()
            },
            edit: function () {
                this.isEdit = true
                return Promise.reject()
            },

            asyncGetCustomerInfo: function () {
                const _self = this

                Customer.GetInfo({
                    ID: _self.customerId
                }).then(function (res) {
                    if (res) {
                        _self.customerData = res
                    }
                })
            },

            asyncGetCustomerStoreList: function () {
                const _self = this

                Customer.GetTenantListByCustomerID({
                    PageSize: _self.customerStorePageSize,
                    PageIndex: _self.customerStorePageIndex,
                    Order: '',
                    OrderAsc: true,
                    ID: _self.customerId
                }).then(function (res) {
                    _self.customerStorePageIndex++
                    _self.customerStorePageSize = res.PageSize

                    _self.customerStoreList = res.Data
                })
            },

            handleOperationClick: function (value, rowData) {
                if (value === 'details') {
                    this.sideBar({
                        title: '门店管理-门店详情',
                        datas: {
                            isEdit: true,
                            storeID: rowData.ID
                        },

                        operation: [{
                            label: '保存',
                            value: 'save',
                            type: 'success'
                        }, {
                            label: '编辑',
                            value: 'edit'
                        }],
                        modules: [{
                            component: StoreAdd
                        }],
                        success: function (data) {
                        }
                    }).show()
                }
            }
        },

        template: `
            <div>
                <ych-sidebar-layout 
                    title="基础信息">

                    <side-bar-form
                        :model="customerData">

                        <ych-form-item 
                            prop="Number"
                            label="客户编号">
                            <el-input 
                                :disabled="true"
                                :value="customerData.Number">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="Name"
                            label="客户姓名">
                            <el-input 
                                :disabled="true"
                                :value="customerData.Name">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="Tel" 
                            label="联系方式">
                            <el-input 
                                :disabled="!isEdit"
                                v-model="customerData.Tel">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="SalesConsultant" 
                            label="销售顾问">
                            <el-input 
                                :disabled="true"
                                :value="customerData.SalesConsultant">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="StoreCount" 
                            label="门店数量">
                            <ych-input-number
                                :disabled="true"
                                :value="customerData.StoreCount">
                            </ych-input-number>
                        </ych-form-item>

                        <ych-form-item 
                            prop="Address" 
                            label="详细地址"
                            :double="true">
                            <el-input 
                                :disabled="!isEdit"
                                v-model="customerData.Address">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="License" 
                            label="执照注册号"
                            :double="true"
                            tips="15位营业执照注册号或18位统一社会信用代码">
                            <el-input 
                                :disabled="true"
                                :value="customerData.License">
                            </el-input>
                        </ych-form-item>
                        
                        <ych-form-item 
                            prop="Remark" 
                            label="客户备注"
                            :double="!isEdit">
                            <el-input 
                                :disabled="!isEdit"
                                type="textarea"
                                :rows="6"
                                v-model="customerData.Remark">
                            </el-input>
                        </ych-form-item>

                    </side-bar-form>

                </ych-sidebar-layout>

                
                <ych-sidebar-layout 
                    title="门店列表">

                    <div slot="footer">
                        <el-button type="text" style="float: right; margin-right: 16px;">
                            查看更多
                        </el-button>
                    </div>

                    <ych-table
                        :columnController="false"
                        :data="customerStoreList">

                        <el-table-column
                            prop="Number"
                            label="序号"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Name"
                            label="门店名称"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Address"
                            label="地址"
                            align="center"
                            :show-overflow-tooltip="true">
                        </el-table-column>

                        <el-table-column
                            prop="State"
                            label="营业状态"
                            align="center">

                            <template slot-scope="scope">
                                <ych-state-tag
                                    v-if="scope.row.State === 'DoBusiness'" 
                                    text="营业中"
                                    state="success"/>

                                <ych-state-tag 
                                    v-else
                                    text="停业"
                                    state="danger"/>
                            </template>
                        </el-table-column>

                        <ych-table-column-operation
                            @operation-click="handleOperationClick"
                            :operation="columnOperation">
                        </ych-table-column-operation>

                    </ych-table>

                </ych-sidebar-layout>
            </div>
        `
    }
})
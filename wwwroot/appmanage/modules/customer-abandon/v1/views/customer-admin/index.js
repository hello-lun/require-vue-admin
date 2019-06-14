define([
    'api/customer/v1/Customer',
    'customer/views/customer-admin/customer-add',
    'customer/views/customer-admin/customer-details'
], function (
    Customer,
    CustomerAdd,
    CustomerDetails
) {
    'use strict';
    
    return {
        name: 'customer-admin',

        data: function () {
            return {
                searchCustomerFormData: {
                    Name: '',
                    Tel: '',
                    SalesConsultant: '',
                    Province: '',
                    City: '',
                    District: '',
                    Number: ''
                },
                customerDataTotalSize: 0,
                customerDataPageIndex: 1,
                customerDataPageSize: 20,

                customerDataList: [],

                columnOperation: [
                    {
                        label: '查看详情',
                        value: 'details'
                    }
                ]
            }
        },

        created: function () {
            this.asyncGetCustomerList();
        },

        methods: {
            asyncGetCustomerList: function () {
                const searchData = _.assign(
                    {
                        PageIndex: this.customerDataPageIndex,
                        PageSize: this.customerDataPageSize,
                        Order: '',
                        OrderAsc: true
                    },
                    this.searchCustomerFormData
                )
                Customer.Search(searchData).then(res => {
                    console.log(res)
                    if (res) {
                        this.customerDataPageIndex = res.PageIndex
                        this.customerDataTotalSize = res.Total
                        this.customerDataList = res.Data
                    }
                }) 
            },

            handleConditionHide: function (prop) {
                this.searchCustomerFormData[prop] = ''
            },

            handleOperationClick: function (value, rowData) {
                const _self = this
                // details
                if (value === 'details') {
                    this.sideBar({
                        title: '客户管理-客户详情',
                        datas: {
                            ID: rowData.ID
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
                            component: CustomerDetails
                        }],
                        success: function (data) {
                            _self.asyncGetCustomerList()
                        }
                    }).show();
                }
            },

            pageSizeChanged: function (pageSize) {
                this.customerDataPageSize = pageSize
                this.asyncGetCustomerList()
            },

            pageIndexChanged: function (pageIndex) {
                this.customerDataPageIndex = pageIndex
                this.asyncGetCustomerList()
            },

            // 新增客户按钮点击
            addCustomerClick () {
                const _self = this
                this.sideBar({
                    title: '客户管理-新增客户',
                    operation: [{
                        label: '批量导入',
                        value: 'import',
                        type: 'success'
                    }, {
                        label: '保存',
                        value: 'save'
                    }],
                    modules: [{
                        component: CustomerAdd
                    }],
                    success: function (data) {
                        _self.asyncGetCustomerList()
                    }
                }).show();
            }
        },

        template: `
            <div style="margin-top: 16px;">
                <ych-report-container>
                    <ych-report-header
                        slot="header"
                        @hide-condition="handleConditionHide"
                        @query-click="asyncGetCustomerList">

                        <ych-form-item 
                            label="客户姓名"
                            key="Name"
                            prop="Name">
                            <el-input v-model="searchCustomerFormData.Name"></el-input>
                        </ych-form-item >

                        <ych-form-item 
                            label="联系电话"
                            key="Tel"
                            prop="Tel">
                            <el-input v-model="searchCustomerFormData.Tel"></el-input>
                        </ych-form-item >

                        <ych-form-item 
                            label="销售代表"
                            key="SalesConsultant"
                            prop="SalesConsultant">
                            <el-input v-model="searchCustomerFormData.SalesConsultant"></el-input>
                        </ych-form-item >

                        <ych-form-item 
                            label="地区"
                            key="Address"
                            prop="Address">
                            <el-input ></el-input>
                        </ych-form-item>

                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :columnController="false"
                        :data="customerDataList">

                        <el-table-column
                            prop="Number"
                            label="编号"
                            align="center"
                            :width="100">
                        </el-table-column>
                        
                        <el-table-column
                            prop="Name"
                            label="客户名称"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Tel"
                            label="联系方式"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="SalesConsultant"
                            label="销售顾问"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Address"
                            label="地址"
                            align="center"
                            :width="500">
                        </el-table-column>

                        <el-table-column
                            prop="StoreCount"
                            label="门店数量"
                            align="center"
                            :width="100">
                        </el-table-column>

                        <el-table-column
                            prop="Remark"
                            label="备注"
                            align="center"
                            :width="260">
                        </el-table-column>

                        <ych-table-column-operation
                            @operation-click="handleOperationClick"
                            :operation="columnOperation">
                        </ych-table-column-operation>

                    </ych-table>

                    <ych-button 
                        @click="addCustomerClick"
                        slot="footerLeft"
                        type="primary">
                        新增客户
                    </ych-button>

                    <ych-pagination
                        slot="footerRight"
                        @size-change="pageSizeChanged"
                        @current-change="pageIndexChanged"
                        :current-page="customerDataPageIndex"
                        :total="customerDataTotalSize">
                    </ych-pagination>
                </ych-report-container>

                
            </div>
        `
    }
})
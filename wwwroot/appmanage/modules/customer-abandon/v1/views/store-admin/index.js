define([
    'api/customer/v1/Tenant',
    'customer/views/store-admin/store-add',
], function (
    Tenant,
    StoreAdd
) {
    'use strict';

    return {

        data: function () {
            return {
                searchStoreFormData: {
                    Name: '',
                    StoreType: '',
                    State: '',
                    CustomerName: '',
                    Tel: '',
                    Province: '',
                    City: '',
                    District: ''
                },
                columnOperation: [{
                    label: '查看详情',
                    value: 'details'
                }],
                storeList: [],

                storeDataTotalSize: 0,
                storeDataPageIndex: 1,
                storeDataPageSize: 20,

                storeTypes: [{
                    key: 'ThemePark',
                    value: '主题乐园'
                },{
                    key: 'AmusementPlace',
                    value: '游乐场所'
                },{
                    key: 'EarlyChildhood',
                    value: '早教机构'
                },{
                    key: 'ScenicSpot',
                    value: '景点景区'
                },{
                    key: 'VideoGame',
                    value: '电玩娱乐'
                }]
            }
        },

        computed: {
            filtersStoreList: function () {
                return this.storeTypes.map(storeType => {
                    return {
                        text: storeType.value,
                        value: storeType.key
                    }
                })
            }
        },

        created: function () {
            this.asyncGetStoreList()
        },

        methods: {
            findStoreValue (key) {
                return this.storeTypes.find(type => {
                    return type.key === key
                }).value
            },

            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },

            handleConditionHide: function (prop) {
                this.searchStoreFormData[prop] = ''
            },

            asyncGetStoreList: function () {
                const _self = this
                const searchData = _.assign(
                    {
                        PageSize: _self.storeDataPageSize,
                        PageIndex: _self.storeDataPageIndex,
                        Order: '',
                        OrderAsc: true
                    },
                    _self.searchStoreFormData
                )

                Tenant.Search(searchData).then(function (res) {
                    _self.storeDataPageIndex = res.PageIndex
                    _self.storeDataTotalSize = res.TotalSize
                    _self.storeList = res.Data
                })
            },

            handleOperationClick: function(value, rowData) {
                const _self = this
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
                            _self.asyncGetStoreList()
                        }
                    }).show()
                }
            },

            pageSizeChanged: function (pageSize) {

            },

            pageIndexChanged: function (pageIndex) {

            },
            
            addStoreClick: function () {
                this.sideBar({
                    title: '门店管理-新增门店',
                    datas: {
                        isEdit: false
                    },
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    modules: [{
                        component: StoreAdd
                    }],
                    success: function (data) {
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
                        @query-click="asyncGetStoreList">

                        <ych-form-item 
                            label="门店名称"
                            key="Name"
                            prop="Name">
                            <el-input v-model="searchStoreFormData.Name"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="门店类型"
                            key="StoreType"
                            prop="StoreType">
                            <el-input v-model="searchStoreFormData.StoreType"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="营业状态"
                            key="State"
                            prop="State">
                            <el-input v-model="searchStoreFormData.State"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="客户姓名"
                            key="CustomerName"
                            prop="CustomerName">
                            <el-input v-model="searchStoreFormData.CustomerName"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="联系电话"
                            key="Tel"
                            prop="Tel">
                            <el-input v-model="searchStoreFormData.Tel"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="地区"
                            key="Address"
                            prop="Address">
                            <el-input></el-input>
                        </ych-form-item>

                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :columnController="false"
                        :data="storeList">

                        <el-table-column
                            prop="Number"
                            label="门店编码"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Name"
                            label="门店名称"
                            align="center"
                            :min-width="200">
                        </el-table-column>

                        <el-table-column
                            prop="Abbreviation"
                            label="门店简称"
                            align="center"
                            :min-width="80">
                        </el-table-column>

                        <el-table-column
                            prop="CustomerName"
                            label="客户姓名"
                            align="center"
                            :min-width="80">
                        </el-table-column>

                        <el-table-column
                            prop="CustomerTel"
                            label="客户电话"
                            align="center"
                            :min-width="100">
                        </el-table-column>

                        <el-table-column
                            prop="StoreType"
                            label="门店类型"
                            align="center"
                            :filter-multiple="false"
                            :filters="filtersStoreList"
                            :filter-method="filterHandler">

                            <template slot-scope="scope">
                                {{findStoreValue(scope.row.StoreType)}}
                            </template>

                        </el-table-column>

                        <el-table-column
                            prop="Person"
                            label="负责人姓名"
                            align="center"
                            :min-width="100">
                        </el-table-column>

                        <el-table-column
                            prop="Tel"
                            label="负责人电话"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="State"
                            label="营业状态"
                            align="center"
                            :filter-multiple="false"
                            :filters="[{text: '营业中', value: 'DoBusiness'}, {text: '停业', value: 'StopBusiness'}]"
                            :filter-method="filterHandler">

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

                        <el-table-column
                            prop="BusinessHours"
                            label="营业时间"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="TenantTel"
                            label="门店电话"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Address"
                            label="门店地址"
                            align="center"
                            :min-width="260">
                        </el-table-column>

                        <el-table-column
                            prop="CreateTime"
                            label="创建时间"
                            align="center"
                            :min-width="150">
                            <template slot-scope="scope">
                                {{scope.row.CreateTime | timeFormate}}                           
                            </template>
                        </el-table-column>

                        <ych-table-column-operation
                            @operation-click="handleOperationClick"
                            :operation="columnOperation">
                        </ych-table-column-operation>

                    </ych-table>

                    <ych-button 
                        @click="addStoreClick"
                        slot="footerLeft"
                        type="primary">
                        新增门店
                    </ych-button>

                    <ych-pagination
                        slot="footerRight"
                        @size-change="pageSizeChanged"
                        @current-change="pageIndexChanged"
                        :current-page="storeDataPageIndex"
                        :total="storeDataTotalSize">
                    </ych-pagination>
                </ych-report-container>
            </div>
        `
    }
})
define([
    'customer/components/Enum',
    'api/customer/v1/Module',
    'customer/views/micro-service-admin/micro-service-add',
], function (
    Enum,
    MicroService,
    MicroServiceAdd
) {
    'use strict';

    return {
        name: 'MicroServiceAdmin',

        data: function () {
            return {
                Enum: {},
                searchMicroServiceFormData: {

                },
                columnOperation: [{
                    label: '查看详情',
                    value: 'details'
                }, {
                    label: '停用',
                    value: 'stopUse'
                }, {
                    label: '启用',
                    value: 'startUse'
                }],
                microServiceList: [],
                microServiceDataPageIndex: 1,
                microServiceDataPageSize: 20,
                microServiceDataTotalSize: 0,
            }
        },

        created: function () {
            this.Enum = Enum
            this.asyncGetMicroServiceList()
        },

        methods: {
            handleConditionHide: function (prop) {
                this.searchMicroServiceFormData[prop] = ''
            },

            asyncGetMicroServiceList: function () {
                const searchData = _.assign(
                    {   
                        PageIndex: this.microServiceDataPageIndex,
                        PageSize: this.microServiceDataPageSize,
                        Order: '',
                        OrderAsc: true
                    },
                    this.searchMicroServiceFormData
                )
                MicroService.Search(searchData).then(res => {
                    this.microServiceDataPageIndex = res.PageIndex
                    this.microServiceDataPageSize = res.PageSize
                    this.microServiceDataTotalSize = res.TotalSize
                    this.microServiceList = res.Data
                })
            },

            pageIndexChanged: function (pageIndex) {
                this.microServiceDataPageIndex = pageIndex
                this.asyncGetMicroServiceList()
            },

            pageSizeChanged: function (pageSize) {
                this.microServiceDataPageSize = pageSize
                this.asyncGetMicroServiceList()
            },

            addMicroServiceClick: function () {
                const _self = this;
                this.sideBar({
                    title: '微服务管理-新增微服务',
                    datas: {
                        isEdit: false
                    },
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    modules: [{
                        component: MicroServiceAdd
                    }],
                    success: function (data) {
                        _self.asyncGetMicroServiceList()
                    }
                }).show();
            },

            handleOperationClick: function (value, rowData) {
                const _self = this
                if (value === 'details') {
                    this.sideBar({
                        title: '微服务管理-微服务详情',
                        datas: {
                            isEdit: true,
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
                            component: MicroServiceAdd
                        }],
                        success: function (data) {
                            _self.asyncGetMicroServiceList()
                        }
                    }).show();
                } else if (value === 'stopUse') {
                    this.$alert('一旦操作成功，不可取消操作', '确定停用微服务？', {
                        confirmButtonText: '确定',
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: action => {
                            action === 'confirm' && this.doUseMicroService(rowData.ID, 'Deactivated')
                        }
                    });
                } else if (value === 'startUse') {
                    this.$alert('一旦操作成功，不可取消操作', '确定启用微服务？', {
                        confirmButtonText: '确定',
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: action => {
                            action === 'confirm' && this.doUseMicroService(rowData.ID, 'Published')
                        }
                    });
                }
            },

            toggleOperation: function (value, rowData) {
                if (value === 'stopUse' && rowData.State === 'Deactivated') {
                    return false
                }

                if (value === 'startUse' && rowData.State === 'Published') {
                    return false
                }
                
                return true
            },

            doUseMicroService: function (ID, State) {
                MicroService.ChangeState({
                    ID: ID,
                    State
                }).then(res => {
                    if (res) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        })
                        this.asyncGetMicroServiceList()
                    } else {
                        this.$message({
                            message: '操作失败',
                            type: 'error'
                        })
                    }
                })
            }
        },

        template: `
            <ych-report-container>
                <ych-report-header
                    slot="header"
                    @hide-condition="handleConditionHide"
                    @query-click="asyncGetMicroServiceList">

                    <ych-form-item 
                        label="模块名称"
                        key="Name"
                        prop="Name">
                        <el-input v-model="searchMicroServiceFormData.Name"></el-input>
                    </ych-form-item>

                    <ych-form-item 
                        label="模块状态"
                        key="State"
                        prop="State">
                        <el-select v-model="searchMicroServiceFormData.State">
                            <el-option label="全部" value=""/>
                            <el-option 
                                v-for="(val, key) in Enum.moduleState"
                                :key="key"
                                :label="val"
                                :value="key"/>
                        </el-select>
                    </ych-form-item>

                    <ych-form-item 
                        label="模块类型"
                        key="ModuleType"
                        prop="ModuleType">
                        <el-select v-model="searchMicroServiceFormData.ModuleType">
                            <el-option label="全部" value=""/>
                            <el-option 
                                v-for="(val, key) in Enum.moduleType"
                                :key="key"
                                :label="val"
                                :value="key"/>
                        </el-select>
                    </ych-form-item>

                    <ych-form-item 
                        label="计费类型"
                        key="ChargeType"
                        prop="ChargeType">
                        <el-select v-model="searchMicroServiceFormData.ChargeType">
                            <el-option label="全部" value=""/>
                            <el-option 
                                v-for="(val, key) in Enum.moduleChargeType"
                                :key="key"
                                :label="val"
                                :value="key"/>
                        </el-select>
                    </ych-form-item>

                </ych-report-header>

                <ych-table
                    slot="main"
                    :columnController="false"
                    :data="microServiceList">

                    <el-table-column
                        prop="Number"
                        label="模块编码"
                        align="center">
                    </el-table-column>

                    <el-table-column
                        prop="Name"
                        label="模块名称"
                        align="center">
                    </el-table-column>

                    <el-table-column
                        prop="ModuleType"
                        label="模块类型"
                        align="center">
                        <template slot-scope="scope">
                            {{Enum.moduleType[scope.row.ModuleType]}}
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="ModuleDescribe"
                        label="模块功能说明"
                        align="center">
                    </el-table-column>

                    <el-table-column
                        prop="ChargeType"
                        label="计费类型"
                        align="center">
                        <template slot-scope="scope">
                            {{Enum.moduleChargeType[scope.row.ChargeType]}}
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="ChargeCycle"
                        label="默认有效期"
                        align="center">
                        <template slot-scope="scope">
                            {{Enum.moduleChargeCycle[scope.row.ChargeCycle]}}
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="State"
                        label="模块状态"
                        align="center">
                        <template slot-scope="scope">
                            {{Enum.moduleState[scope.row.State]}}
                        </template>
                    </el-table-column>

                    <ych-table-column-operation
                        @operation-click="handleOperationClick"
                        :operation="columnOperation"
                        :toggle="toggleOperation">
                    </ych-table-column-operation>

                </ych-table>

                <ych-button 
                    @click="addMicroServiceClick"
                    slot="footerLeft"
                    type="primary">
                    新增微服务
                </ych-button>

                <ych-pagination
                    slot="footerRight"
                    @size-change="pageSizeChanged"
                    @current-change="pageIndexChanged"
                    :current-page="microServiceDataPageIndex"
                    :total="microServiceDataTotalSize">
                </ych-pagination>

            </ych-report-container>
        `
    }
})
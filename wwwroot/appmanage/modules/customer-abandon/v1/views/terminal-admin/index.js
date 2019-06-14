define([
    'api/customer/v1/TerminalManagement',
    'customer/components/Enum',
    'customer/views/terminal-admin/terminal-detail'
], function (
    TerminalManagement,
    Enum,
    TerminalDetail
) {
    'use strict';

    return {
        name: 'TerminalAdmin',

        data: function () {
            return {
                searchTerminalFormData: {
                    Account: '',
                    Name: '',
                    Tel: '',
                    Department: ''
                },
                terminalList: [],
                columnOperation: [{
                    label: '查看详情',
                    value: 'details'
                }],

                terminalDataPageIndex: 1,
                terminalDataPageSize: 20,
                terminalDataTotalSize: 0
            }
        },

        created: function () {
            this.Enum = Enum
            this.asyncGetTerminalList()
        },

        methods: {
            handleConditionHide: function (prop) {
                this.terminalList[prop] = ''
            },

            asyncGetTerminalList: function () {
                const searchTerminalFormData = _.assign(
                    {
                        PageIndex: this.terminalDataPageIndex,
                        PageSize: this.terminalDataPageSize,
                        Order: '',
                        OrderAsc: true
                    },
                    this.searchTerminalFormData
                )
                TerminalManagement.Search(searchTerminalFormData).then(res => {
                    if (res) {
                        this.terminalDataPageIndex = res.PageIndex
                        this.terminalDataTotalSize = res.TotalSize
                        this.terminalList = res.Data
                    }
                })
            },

            handleOperationClick: function (value, rowData) {
                const _self = this
                if (value === 'details') {
                    this.sideBar({
                        title: '终端设备管理-终端详情',
                        datas: {
                            ID: rowData.ID
                        },
                        operation: [],
                        modules: [{
                            component: TerminalDetail
                        }],
                        success: function (data) {
                        }
                    }).show();
                }
            },

            pageSizeChanged: function (pageSize) {
                this.terminalDataPageSize = pageSize
                this.asyncGetTerminalList()
            },

            pageIndexChanged: function (pageIndex) {
                this.terminalDataPageIndex = pageIndex
                this.asyncGetTerminalList()
            }
        },

        template: `
            <div style="margin-top: 16px;">
                <ych-report-container>
                    <ych-report-header
                        slot="header"
                        @hide-condition="handleConditionHide"
                        @query-click="asyncGetTerminalList">

                        <ych-form-item 
                            label="终端类别"
                            key="TerminalType"
                            prop="TerminalType">
                            <el-select v-model="searchTerminalFormData.TerminalType">
                                <el-option 
                                    v-for="(val, key) in Enum.terminalType"
                                    :label="val"
                                    :key="key"
                                    :value="key"/>
                            </el-select>
                        </ych-form-item>

                        <ych-form-item 
                            label="终端状态"
                            key="TerminalState"
                            prop="TerminalState">
                            <el-select v-model="searchTerminalFormData.TerminalState">
                                <el-option 
                                    v-for="(val, key) in Enum.terminalState"
                                    :label="val"
                                    :key="key"
                                    :value="key"/>
                            </el-select>
                        </ych-form-item>

                        <ych-form-item 
                            label="终端名称"
                            key="Name"
                            prop="Name">
                            <el-input v-model="searchTerminalFormData.Name"/>
                        </ych-form-item>

                        <ych-form-item 
                            label="终端标识码"
                            key="PortNum"
                            prop="PortNum">
                            <el-input v-model="searchTerminalFormData.PortNum"/>
                        </ych-form-item>


                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :columnController="false"
                        :data="terminalList">

                        <el-table-column
                            prop="Number"
                            label="编码"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Name"
                            label="终端名称"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="PortNum"
                            label="终端标识码"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="TerminalType"
                            label="终端类型"
                            align="center">
                            <template slot-scope="scope">
                                {{Enum.terminalType[scope.row.TerminalType]}}
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="TerminalState"
                            label="终端状态"
                            align="center">
                            <template slot-scope="scope">
                                <span style="font-weight: bold; color: #000;">
                                    {{Enum.terminalState[scope.row.TerminalState]}}
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="NetworkState"
                            label="网络状态"
                            align="center">
                            <template slot-scope="scope">
                                <span style="font-weight: bold; color: green;" v-if="scope.row.NetworkState === 'Online'">在线</span>
                                <span style="font-weight: bold; color: red;" v-else>离线</span>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="AppVersion"
                            label="固件版本号"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="InstallationAddress"
                            label="终端安装地址"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="TenantName"
                            label="门店名称"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="TenantTel"
                            label="门店电话"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="CreatorName"
                            label="操作人"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="CreateTime"
                            label="操作时间"
                            align="center">
                        </el-table-column>

                        <ych-table-column-operation
                            @operation-click="handleOperationClick"
                            :operation="columnOperation">
                        </ych-table-column-operation>

                    </ych-table>

                    <ych-pagination
                        slot="footerRight"
                        @size-change="pageSizeChanged"
                        @current-change="pageIndexChanged"
                        :current-page="terminalDataPageIndex"
                        :total="terminalDataTotalSize">
                    </ych-pagination>
                </ych-report-container>
            </div>
        `
    }
})
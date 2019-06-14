define([
    'api/customer/v1/User',
    'customer/views/user-account-admin/user-account-add',
], function (
    User,
    UserAccountAdd
) {
    'use strict';

    return {
        name: 'UserAccountAdmin',

        data: function () {
            return {
                searchUserFormData: {
                    Account: '',
                    Name: '',
                    Tel: '',
                    Department: ''
                },
                userList: [],
                columnOperation: [{
                    label: '查看详情',
                    value: 'details'
                }, {
                    label: '禁用',
                    value: 'stopUse'
                }, {
                    label: '启用',
                    value: 'startUse'
                }],

                userDataPageIndex: 1,
                userDataPageSize: 20,
                userDataTotalSize: 0
            }
        },

        created: function () {
            this.asyncGetUserList()
        },

        methods: {
            handleConditionHide: function (prop) {
                this.userList[prop] = ''
            },

            asyncGetUserList: function () {
                const searchUserFormData = _.assign(
                    {
                        PageIndex: this.userDataPageIndex,
                        PageSize: this.userDataPageSize,
                        Order: '',
                        OrderAsc: true
                    },
                    this.searchUserFormData
                )
                User.Search(searchUserFormData).then(res => {
                    if (res) {
                        this.userDataPageIndex = res.PageIndex
                        this.userDataTotalSize = res.TotalSize
                        this.userList = res.Data
                    }
                })
            },

            handleOperationClick: function (value, rowData) {
                if (value === 'details') {
                    this.sideBar({
                        title: '用户账户管理-用户详情',
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
                            component: UserAccountAdd
                        }],
                        success: function (data) {
                        }
                    }).show();
                } else if (value === 'stopUse') {
                    this.$alert('一旦操作成功，不可取消操作', '确认进行禁用用户账户操作？', {
                        confirmButtonText: '确定',
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: action => {
                            action === 'confirm' && this.doStopUseUser(rowData.ID, false)
                        }
                    });
                } else if (value === 'startUse') {
                    this.$alert('一旦操作成功，不可取消操作', '确认进行启用用户账户操作？', {
                        confirmButtonText: '确定',
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: action => {
                            action === 'confirm' && this.doStopUseUser(rowData.ID, true)
                        }
                    });
                }
            },
            
            toggleOperation: function (value, rowData) {
                if (value === 'stopUse' && rowData.State === false) {
                    return false
                }

                if (value === 'startUse' && rowData.State === true) {
                    return false
                }

                return true
            },

            doStopUseUser: function (userId, State) {
                User.ChangeState({
                    ID: userId,
                    State
                }).then(res => {
                    this.$message({
                        message: '禁用成功',
                        type: 'success'
                    })
                    this.asyncGetUserList()
                })
            },

            addUserClick: function () {
                const _self = this
                this.sideBar({
                    title: '用户账户管理-新增用户',
                    datas: {
                        isEdit: false
                    },
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    modules: [{
                        component: UserAccountAdd
                    }],
                    success: function (data) {
                        _self.asyncGetUserList()
                    }
                }).show();
            },

            pageSizeChanged: function (pageSize) {
                this.userDataPageSize = pageSize
                this.asyncGetUserList()
            },

            pageIndexChanged: function (pageIndex) {
                this.userDataPageIndex = pageIndex
                this.asyncGetUserList()
            }
        },

        template: `
            <div style="margin-top: 16px;">
                <ych-report-container>
                    <ych-report-header
                        slot="header"
                        @hide-condition="handleConditionHide"
                        @query-click="asyncGetUserList">

                        <ych-form-item 
                            label="用户账户"
                            key="Account"
                            prop="Account">
                            <el-input v-model="searchUserFormData.Account"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="用户姓名"
                            key="Name"
                            prop="Name">
                            <el-input v-model="searchUserFormData.Name"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="联系电话"
                            key="Tel"
                            prop="Tel">
                            <el-input v-model="searchUserFormData.Tel"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="所属单位"
                            key="Department"
                            prop="Department">
                            <el-input v-model="searchUserFormData.Department"></el-input>
                        </ych-form-item>


                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :columnController="false"
                        :data="userList">

                        <el-table-column
                            prop="Number"
                            label="用户编码"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Account"
                            label="用户账户"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="AccountLevel"
                            label="账户级别"
                            align="center">
                            <template slot-scope="scope">
                                {{
                                    {Administrators: '管理员', User: '用户'}[scope.row.AccountLevel]
                                }}
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="Name"
                            label="用户姓名"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Tel"
                            label="联系电话"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Department"
                            label="所属单位"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="Post"
                            label="岗位"
                            align="center">
                        </el-table-column>

                        <el-table-column
                            prop="EntryTime"
                            label="入职时间"
                            align="center">
                            <template slot-scope="scope">
                                {{scope.row.EntryTime | timeFormate}}
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="CreateTime"
                            label="创建时间"
                            align="center">
                            <template slot-scope="scope">
                                {{scope.row.CreateTime | timeFormate}}
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="CreatorName"
                            label="创建人"
                            align="center">
                        </el-table-column>

                        <ych-table-column-operation
                            @operation-click="handleOperationClick"
                            :operation="columnOperation"
                            :toggle="toggleOperation">
                        </ych-table-column-operation>

                    </ych-table>

                    <ych-button 
                        @click="addUserClick"
                        slot="footerLeft"
                        type="primary">
                        新增用户
                    </ych-button>

                    <ych-pagination
                        slot="footerRight"
                        @size-change="pageSizeChanged"
                        @current-change="pageIndexChanged"
                        :current-page="userDataPageIndex"
                        :total="userDataTotalSize">
                    </ych-pagination>
                </ych-report-container>
            </div>
        `
    }
})
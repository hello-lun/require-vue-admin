define([
    'api/account/v1/Account',
    'account/views/account-create',
], function (
    Account,
    AccountCreate
) {
    'use strict';

    return {
        name: 'DeviceList',
        components: {
        },

        created: function () {
            this.asyncGetAccountList();
        },

        data: function () {
            return {
                accountList: [],
                columnOperation: [{
                    label: '编辑',
                    value: 'edit'
                }, {
                    label: '删除',
                    value: 'delete'
                }],
                pageIndex: 1,
                pageSize: 20,
                totalSize: 0,
            };
        },

        methods: {
            asyncGetAccountList () {
                Account.AccountList({
                    PageIndex: this.pageIndex,
                    PageSize: this.pageSize
                }).then(res => {
                    this.accountList = res.Data
                    this.pageIndex = res.PageIndex
                    this.pageSize = res.PageSize
                    this.totalSize = res.TotalSize
                })
            },

            handleOperationClick (value, item) {
                let _self = this
                if (value === 'edit') {
                    this.sideBar({
                        title: '账号管理-账号编辑',
                        datas: {
                            accountInfo: item
                        },
                        operation: [{
                            label: '保存',
                            value: 'save',
                            type: 'success'
                        }],
                        modules: [{
                            component: AccountCreate
                        }],
                        success: function (data) {
                            _self.asyncGetAccountList()
                        }
                    }).show();
                } else if (value === 'delete') {
                    this.$confirm(`是否确定删除?\n${item.Account}【${item.Name}】`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        _self.deleteAccount(item.ID)
                      })
                }
            },

            pageSizeChanged (pageSize) {
                this.pageSize = pageSize
                this.asyncGetAccountList()
            },

            pageIndexChanged (pageIndex) {
                this.pageIndex = pageIndex
                this.asyncGetAccountList()
            },

            deleteAccount (id) {
                Account.AccountDelete({
                    ID: id,
                }).then(res => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    this.asyncGetAccountList()
                })
            },

            addAccount () {
                let _self = this
                this.sideBar({
                    title: '账号管理-账号新增',
                    datas: {},
                    operation: [{
                        label: '保存',
                        value: 'save',
                        type: 'success'
                    }],
                    modules: [{
                        component: AccountCreate
                    }],
                    success: function (data) {
                        _self.asyncGetAccountList()
                    }
                }).show();
            },

            handleOperationToggle: function (name, row) {
                var is = true;

                if (row.IsManager) {
                    is = false;
                }
      
                return is;
              },
        },

        template: `
        <el-card :body-style="{'min-height': '100%'}" >
            <ych-report-container>
                <ych-table
                    slot="main"
                    :columnController="false"
                    :data="accountList">

                    <el-table-column
                        prop="Account"
                        label="账号"
                        align="center">
                    </el-table-column>

                    <el-table-column
                        prop="Name"
                        label="姓名"
                        align="center">
                    </el-table-column>

                    <el-table-column
                        prop="CreatorName"
                        label="创建人"
                        align="center">
                        <template slot-scope="scope">
                            {{scope.row.CreatorAccount}}({{scope.row.CreatorName}})
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

                    <ych-table-column-operation
                        @operation-click="handleOperationClick"
                        :toggle="handleOperationToggle"
                        :operation="columnOperation">
                    </ych-table-column-operation>

                </ych-table>

                <ych-button 
                    @click="addAccount"
                    slot="footerLeft"
                    type="primary">
                    新增账号
                </ych-button>

                <ych-pagination
                    slot="footerRight"
                    @size-change="pageSizeChanged"
                    @current-change="pageIndexChanged"
                    :current-page="pageIndex"
                    :total="totalSize">
                </ych-pagination>
            </ych-report-container>
        </el-card>
        `
    }
});
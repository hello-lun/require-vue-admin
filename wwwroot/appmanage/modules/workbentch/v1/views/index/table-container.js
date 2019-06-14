define([
    'workbentch/views/index/query-conditions',
    'framework/api/workbentch/v1/Task',
    'workbentch/components/notice-create',
    'workbentch/components/notice-detail'
], function(
    QueryConditions, 
    Task,
    NoticeCreate,
    NoticeDetail
) {
    'use strict';

    return {
        name: 'TableContainer',

        components: {
            QueryConditions: QueryConditions
        },

        mounted: function () {
            this.$refs.query.submit();
            this.initTableHeight();
        },

        props: {
            status: {
                type: String,
                require: true
            }
        },

        data: function () {
            // 表格高度,
            // 10：卡片内边距，
            // 40:tab高度，
            // 15:tab外边距, 
            // 5:误差值
            var tableHeight = this.pageContainerHeight - 10 - 40 - 15 - 5;

            return {
                tableHeight: tableHeight,
                queryConditions: {},
                tableData: [],
                pageInfo: {
                    PageIndex: 1,
                    PageSize: 20
                },
                columnOpration: [
                    {
                        label: '查看',
                        value: 'see'
                    }
                ],
                dataTotal: 0,
                sort: {}
            };
        },

        methods: {
            fetchDataList: function () {
                var self = this;
                Task.QueryTask(
                    _.extend(
                        {Status: this.status}, 
                        this.pageInfo, 
                        this.queryConditions,
                        this.sort
                    )
                ).then(function (res) {
                    self.tableData = res.Data;
                    self.dataTotal = res.TotalCount;
                });
            },

            handleSizeChange: function (size) {
                this.pageInfo.PageSize = size;
                this.fetchDataList();
            },

            handleCurrentChange: function (index) {
                this.pageInfo.PageIndex = index;
                this.fetchDataList();
            },
            // 查询条件提交事件
            handleQuerySubmit: function (data) {
                var self = this;
                this.queryConditions = data;
                this.$nextTick(self.fetchDataList);
            },
            // 初始化表格高度
            initTableHeight: function () {
                this.tableHeight -= (this.$refs.footer.$el.clientHeight + this.$refs.query.$el.clientHeight);
            },
            // 任务状态格式化
            statusFormatter: function (status) {
                var map = {
                    All: '所有',
                    Wait: '待办',
                    Process: '处理中',
                    Complete: '已完成',
                    Readed: '已读',
                    UnRead: '未读',
                    Refused: '已驳回',
                    Revocation: '已撤销'
                };

                return map[status] || '-';
            },

            // 任务来源格式化
            originSourceFormatter: function (source) {
                var map = {
                    All: '全部',
                    SendToMe: '发送给我的',
                    CopyToMe: '抄送给我的',
                    IStarted: '我发起的'
                };

                return map[source] || '-';
            },

            // 任务类型
            typeFormatter: function (type) {
                var map = {
                    All: '所有',
                    Excute: '执行实施',
                    Approve: '审批申请',
                    Notice: '公告通知'
                }

                return map[type] || '-';
            },

            // 新建公告通知
            createNotice: function () {
                var self = this;
                this.sideBar({
                    title: '新建公告通知',
                    size: 'medium',
                    modules: [{
                      component: NoticeCreate
                    }],
                    operation: [{
                        label: '发送',
                        value: 'send'
                    }],
                    success: function (data) {
                        self.fetchDataList();
                    }
                }).show();
            },
            // 处理表格行的点击事件
            handleTableRowClik: function (row) {
                var self = this;
                // 取消未读标记
                Task.ReadTask({ID: row.ID})
                    .then(function () {
                        // ...
                    });

                var operation = [];
               
                // 根据通知的数据配置侧栏不同的操作按钮
                // 审批通知 和 发送给我的
                if (row.Type === 'Approve'){
                    // 待办
                    if (row.Status === 'Wait') {
                        // 发送给我的
                        if (row.OriginSource === 'SendToMe') {
                            operation = [{
                                label: '驳回',
                                value: 'reject',
                                type: 'danger'
                            }, {
                                label: '审批通过',
                                value: 'pass'
                            }];
                        // 我发起的
                        } else if (row.OriginSource === 'IStarted') {
                            operation = [{
                                label: '撤回',
                                value: 'recall',
                                type: 'danger'
                            }];
                        }
                    // 处理中 并且 是发送给我的
                    } else if (row.Status === 'Process' && row.OriginSource === 'SendToMe') {
                        operation = [{
                            label: '驳回',
                            value: 'reject',
                            type: 'danger'
                        }, {
                            label: '审批通过',
                            value: 'pass'
                        }];
                    }
                // 执行实施
                } else if (row.Type === 'Excute') {
                    // 待办
                    if (row.Status === 'Wait') {
                        // 发送给我
                        if (row.OriginSource === 'SendToMe') {
                            operation = [{
                                label: '完成',
                                value: 'complete'
                            }];
                        // 我发起的
                        } else if (row.OriginSource === 'IStarted') {
                            operation = [{
                                label: '撤回',
                                value: 'recall',
                                type: 'danger'
                            }];
                        }
                    }
                }

                this.showSidebar(operation, row);
            },

            showSidebar: function (operation, row) {
                var self = this;

                this.sideBar({
                    title: row.Topic,
                    size: 'medium',
                    modules: [{
                        component: NoticeDetail
                    }],
                    datas: {
                        id: row.ID
                    },
                    operation: operation,
                    success: function (data) {
                        self.fetchDataList();
                    }
                }).show();
            },
            // 处理表格排序事件
            handleTableSortChange: function (sort) {
                this.sort['Order'] = sort.prop;
                this.sort['Asc'] = sort.order === 'ascending' ? true : sort.order === null ? null : false;

                var self = this;
                this.$nextTick(function () {
                    self.fetchDataList();
                });
            },

            // 处理表格操作列
            handleTableOperationClick: function (name, row) {
                this.handleTableRowClik(row);
            }
        },

        template: `
            <div>
                <query-conditions 
                    ref="query"
                    @subimit="handleQuerySubmit">
                </query-conditions>
                <el-table
                    :data="tableData"
                    @row-click="handleTableRowClik"
                    @sort-change="handleTableSortChange"
                    :height="tableHeight"
                    style="width: 100%" border>
                    <el-table-column
                        prop="SerialNumber"
                        label="编号"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="Status"
                        label="任务状态"
                        width="110" 
                        sortable="custom">
                        <template slot-scope="scope">
                            {{ statusFormatter(scope.row.Status) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="Type"
                        label="任务类型"
                        width="110"
                        sortable="custom">
                        <template slot-scope="scope">
                            {{ typeFormatter(scope.row.Type) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="OriginSource"
                        label="任务来源"
                        width="110"
                        sortable="custom">
                        <template slot-scope="scope">
                            {{ originSourceFormatter(scope.row.OriginSource) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="Topic"
                        label="主题"
                        width="560">
                        <template slot-scope="scope">
                            <el-badge v-if="!scope.row.Readed" is-dot></el-badge>
                            {{ scope.row.Topic }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="Sponsor"
                        label="发起人"
                        width="260">
                    </el-table-column>
                    <el-table-column
                        prop="CreateTime"
                        label="创建时间"
                        width="102"
                        sortable="custom">
                        <template slot-scope="scope">
                            {{ scope.row.CreateTime | timeFormate('YYYY-MM-DD HH:mm:ss')  }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="LastOperator"
                        label="最后操作人"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="OperateTime"
                        label="操作时间"
                        width="102"
                        sortable="custom">
                        <template slot-scope="scope">
                            {{ scope.row.OperateTime | timeFormate('YYYY-MM-DD HH:mm:ss')  }}
                        </template>
                    </el-table-column>
                    <ych-table-column-operation
                        @operation-click="handleTableOperationClick"
                        :operation="columnOpration">
                    </ych-table-column-operation>
                </el-table>

                <el-row 
                    ref="footer" 
                    style="padding: 5px 5px 0;" 
                    type="flex" 
                    justify="space-between">
                    <el-button 
                        @click="createNotice"
                        size="small" 
                        type="primary">
                        新建通知
                    </el-button>
                    <ych-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageInfo.PageIndex"
                        :page-size="pageInfo.PageSize"
                        :total="dataTotal">
                    </ych-pagination>
                </el-row>
            </div>
        `
    }
});
define([
    'framework/mixins/sidebar-form',
    'framework/api/workbentch/v1/Task',
    'framework/api/workbentch/v1/Notice',
    'framework/api/workbentch/v1/Approve',
    'framework/api/File/v1/File'
], function(sideBarForm, Task, Notice, Approve, File) {
    'use strict';
    
    return {
        name: 'SidebarNoticeDetail',

        mixins: [sideBarForm],

        created: function () {
            this.fetchNoticDetail();
        },

        data: function () {
            return {
                detail: {
                    ApprovalRecords: [],
                    AttachFiles: [],
                    Content: '',
                    CreateTime: '',
                    ID: '',
                    Logs: [],
                    Receivers: [],
                    Status: 0,
                    Topic: null,
                    Type: 0,
                    Sponsor: ''
                },
                downloadFileKey: [] 
            };
        },

        methods: {
            // 完成
            complete: function (cb) {
                Approve.ExamineApprove({
                    ID: self.incomingData.id
                }).then(function () {
                    cb();
                    self.$message({
                        type: 'success',
                        message: `实施完成!`
                    });
                }).catch(function () {
                    cb(false);
                });
            },

            // 撤回
            recall: function (cb) {
                var self = this;
                this.$confirm(
                    '<strong>确定撤回？</strong></br>撤回操作不可取消，如需再次编辑发送，请于业务板块重新发起！', 
                    '提示', 
                    {
                        dangerouslyUseHTMLString: true,
                        confirmButtonClass: 'el-button--danger',
                        confirmButtonText: '确定撤回',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function () {
                        Notice.RevocationNotice({
                            ID: self.incomingData.id
                        }).then(function () {
                            cb()
                            self.$message({
                                type: 'success',
                                message: `撤回审批申请成功！`
                            });
                        }).catch(function () {
                            cb(false);
                        });
                    }, function () {
                        cb(false);
                    }).catch();
                
            },

            // 驳回
            reject: function (cb) {
                var self = this;
                var refuseApprove = function (value) {
                    Approve.RefuseApprove({
                        ID: self.incomingData.id,
                        Reason: value
                    }).then(function () {
                        cb();
                        self.$message({
                            type: 'success',
                            message: `驳回审批申请成功！`
                        });
                    }, function () {
                        cb(false);
                    }).catch(function () {
                        cb(false);
                    });
                };

                this.$prompt('确认驳回审批？', '提示', {
                    confirmButtonText: '驳回审批',
                    cancelButtonText: '取消',
                    confirmButtonClass: 'el-button--danger',
                    inputPlaceholder: '请输入驳回原因',
                    inputValidator: function (val) {
                        if (val) return true;

                        return '驳回原因不能为空！';
                    },
                    // type: 'warning'
                }).then(function (value) {
                    refuseApprove(value);
                }, function() {
                    cb(false);
                }).catch();
                
            },

            // 通过
            pass: function (cb) {
                var self = this;
                var examineApprove = function (value) {
                    Approve.ExamineApprove({
                        ID: self.incomingData.id,
                        Reason: value
                    }).then(function () {
                        cb();
                        self.$message({
                            type: 'success',
                            message: `审批申请通过成功！`
                        });
                    }).catch(function () {
                        cb(false);
                    });
                };

                this.$prompt('确认完成审批？', '提示', {
                    confirmButtonText: '审批通过',
                    showCancelButton: false,
                    inputPlaceholder: '请输入审批通过原因',
                    inputValidator: function (val) {
                        if (val) return true;

                        return '审批通过原因不能为空！';
                    },
                    // type: 'warning'
                }).then(function (value) {
                    examineApprove(value);
                }, function () {
                    cb(false);
                }).catch();
            },
            // 获取任务详情数据
            fetchNoticDetail: function () {
                var self = this;
                Task.GetTaskDetail({ID: this.incomingData.id})
                    .then(function (res) {
                        console.log(res);
                        _.extend(self.detail, res);
                    });
            },
            // 移除下载状态的文件key
            removeFileKey: function (key) {
                var index = this.downloadFileKey.indexOf(key);
                this.downloadFileKey.splice(index, 1);
            },

            handleReceiversStatus: function (receiver) {
                var statusClass;
                if (receiver.Status === 'Passed') {
                    statusClass = 'el-icon-circle-check color-success';
                } else if (receiver.Status === 'Refused') {
                    statusClass = 'el-icon-circle-close color-danger';
                }

                return statusClass;
            },

            // 附件下载
            donwloadFile: function (fileInfo) {
                var self = this,
                    key = fileInfo.Key;
                // 加载中
                this.downloadFileKey.push(key);
                File.GenerateUrl(key)
                    .then(function (url) {
                        url && window.open(url);
                        self.removeFileKey(key);
                    })
                    .catch(function () {
                        self.removeFileKey(key);
                    });
            }
        },

        template: `
            <div class="sidebar-notice-detail">
                <ych-sidebar-layout :header-divider="true">
                    <div slot="title">发起人：{{ detail.Sponsor }}</div>
                    <div slot="subtitle">{{ detail.CreateTime | timeFormate('YYYY-MM-DD HH:mm:ss') }}</div>
                    <div>{{ detail.Content }}</div>
                </ych-sidebar-layout>

                <ych-sidebar-layout >
                    <h4 slot="title">附件：</h4>
                    <div v-for="item in detail.AttachFiles">
                        <ych-button 
                            @click="donwloadFile(item)" 
                            :loading="downloadFileKey.indexOf(item.Key) > -1"
                            :underline="true"
                            type="text">
                            {{ item.Name }}
                            <i class="el-icon-download  el-icon--right"></i>
                        </ych-button>
                    </div>
                </ych-sidebar-layout>

                <ych-sidebar-layout 
                    v-if="detail.Type === 'Approve'"
                    :header-divider="true" >
                    <h4 slot="title">待办：</h4>
                    <div slot="subtitle">
                        <span>
                            <i class="el-icon-circle-check color-success"></i>
                            已审批
                        </span>
                        <span>
                            <i class="el-icon-circle-close color-danger"></i>
                            审批不通过
                        </span>
                    </div>
                    <div>
                        <el-tooltip 
                            v-for="item in detail.Receivers"
                            :key="item.Name"
                            :content="item.Position" 
                            placement="bottom">
                            <el-tag 
                                type="info" 
                                style="margin-left: 5px; position:relative">
                                <i 
                                    style="position:absolute; top:-4px; right:-4px;" 
                                    :class="handleReceiversStatus(item)"></i>
                                {{ item.Name }}
                            </el-tag>
                        </el-tooltip>
                    </div>
                </ych-sidebar-layout>

                <ych-sidebar-layout  :header-divider="true">
                    <h4 slot="title">日志：</h4>
                    <div v-for="(logItem, index) in detail.Logs" :key="logItem.OperateInfo">
                        <small>{{index + 1 }}、 {{ logItem.OperateInfo }}</small>
                    </div>
                </ych-sidebar-layout>
            </div>
        `
    }
});
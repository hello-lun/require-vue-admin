define([
  'mixins/pagination',
  'api/operation/v1/Audit',
  'customer/components/sidebar-audit-detail'
], function (
  pagination,
  Audit,
  SidebarAuditDetail
) {
    'use strict';

    // 操作列按钮
    var operationGroup = [
      {
        label: '查看',
        value: 'detail'
      }, {
        label: '提交',
        value: 'submit'
      }, {
        label: '通过',
        value: 'pass'
      }, {
        label: '驳回',
        value: 'reject'
      }, 
    ];

    return {
      name: 'CustomerList',

      mixins: [ pagination ],

      created: function () {
        // 初始化分页混合更新方法
        this.paginationUpdateFn = this.asyncGetDataList;

        this.asyncGetDataList();
      },

      data: function () {
        return {
          columnOpration: operationGroup,
          formData: {
            StartTime: null,
            EndTime: null,
            CustomerName: null,
            Status: null
          },

          dataList: [],

          WeChatCustomerID: '',
          AlipayID: '',
          dialogFormVisible: false,
          passData: null,

          customerStatusEnum: {
            WaitAudit: '待提交微信审核',
            SubmitedAudit: '已提交微信审核',
            RejectedAudit: '已驳回审核',
            ToSubmitVerification: '待主体提交验证',
            ToVerification: '待验证',
            RejectedVerification: '已驳回验证',
            Completed: '已完成认证',
          }

        };
      },

      computed: {
        createTime: {
          get: function () {
            if (this.formData.StartTime) {
              return [
                this.formData.StartTime ? new Date(this.formData.StartTime) : null,
                this.formData.EndTime ? new Date(this.formData.EndTime) : null,
              ];
            }

            return null;
          },

          set: function (val) {
            var time = val || [null, null];
            this.formData.StartTime = time[0] || null;
            this.formData.EndTime = time[1] || null;
          }
        },
      },

      methods: {
        queryBtnClick: function () {
          this.paginationInfo.PageIndex = 1;
          this.asyncGetDataList();
        },
        asyncGetDataList: function () {
          var self = this;

          Audit
            .List(self.handleSubmitData())
            .then(function (data) {
              self.dataList = data.List;
              self.paginationTotal = data.Total;
            });
        },

        // 处理提交数据
        handleSubmitData: function () {
          var date = {};
          if (
            this.formData.StartTime 
            && this.formData.StartTime === this.formData.EndTime
          ) {
            date.EndTime = this.$moment(this.formData.EndTime).second(59).minute(59).hour(23).valueOf();
          }

          return _.extend(
            {},
            this.formData,
            date,
            this.paginationInfo
          );
        },

        handleDetailSidebarOperation: function (status) {
          var operation;

          switch (status) {
            case 'WaitAudit':
              operation = [{
                label: '提交',
                value: 'submit',
              }];
              break;

            case 'SubmitedAudit':
              operation = [{
                label: '通过',
                value: 'wechatPass',
                type: 'success',
              }, {
                label: '驳回',
                value: 'wechatReject',
                type: 'danger',
              }];
              break;

            case 'ToVerification':
              operation = [{
                label: '通过',
                value: 'customerPass',
                type: 'success',
              }, {
                label: '驳回',
                value: 'customerReject',
                type: 'danger',
              }];
              break;

            default: 
              operation = [];
          }

          return operation;
        },

        showAuditDetail: function (data) {
          var self = this,
              id = data.ID;

          var operation = this.handleDetailSidebarOperation(data.Status);
          this.sideBar({
            title: '审核资料',
            datas: {
              id: id
            },
            operation: operation,
            modules: [{
              component: SidebarAuditDetail
            }],
            success: function () {
              self.asyncGetDataList();
            }
          }).show();
        },

        handleSubmitOfOperation: function (data) {
          var self = this;
          this.$confirm(
            '是否已在微信提交新增特约商户的申请？', 
            '提醒'
          ).then(function () {
            return Audit.WechatSubmit({ ID: data.ID });
          }).then(function () {
            self.$message.success('已确定提交');
            self.asyncGetDataList();
          });
        },
        // 处理通过操作(pass)
        handlePassOfOperation: function (data) {
          this.WeChatCustomerID = '';
          this.AlipayID = '';
          (data.Status === 'SubmitedAudit') ? this.handleWechatPass(data) : this.handleCustomerPass(data);
        },
        handleWechatPass: function (data) {
          this.dialogFormVisible = true;
          this.passData = data;
        },
        postWechatPass() {
          if (!this.WeChatCustomerID) {
            this.$message({
              message: `'请输入微信子商户号'`,
              type: 'warning'
            });
            return;
          }
          Audit.WechatPass({
            ID: this.passData.ID,
            BusinessNumber: this.WeChatCustomerID,
            AlipayID: this.AlipayID,
          }).then(() => {
            this.$message.success('资料审核已通过！');
            this.asyncGetDataList();
            this.dialogFormVisible = false;
          });
        },
        // 微信审核通过
        handleWechatPass2: function (data) {
          var self = this;
          var validator = function (val) {
            if (!val) return false;
            return true;
          };

          this.$prompt('请填写该主题的微信支付商户号', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: validator,
            inputErrorMessage: '请输入微信支付商户号！',
          })
          .then(function (config) {
            return Audit.WechatPass({
              ID: data.ID,
              BusinessNumber: config.value
            }).then(function () {
              self.$message.success('资料审核已通过！');
              self.asyncGetDataList();
            })
          }, function () {})
          .catch(function () {});
        },
        // 主体审核通过
        handleCustomerPass: function (data) {
          var self = this;
          Audit
            .CustomerPass({ ID: data.ID })
            .then(function () {
              self.$message.success('主体审核已通过');
              self.asyncGetDataList();
            });
        },
        // 处理驳回操作(reject)
        handleRejectOfOperation: function (data) {
          var allowStatus = ['SubmitedAudit', 'ToVerification'];
          if (!~allowStatus.indexOf(data.Status)) return;

          var fnName = (data.Status === 'SubmitedAudit') ? 'WechatReject' : 'CustomerReject';
          var self = this;
          var validator = function (val) {
            if (!val) return false;
            return true;
          };

          this.$prompt('请填写驳回理由', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: validator,
            inputType: 'textarea',
            inputErrorMessage: '请输入驳回理由'
          })
          .then(function (config) {
            return Audit[fnName]({
              ID: data.ID,
              Remarks: config.value
            }).then(function () {
              var msg = (data.Status === 'SubmitedAudit') ? '微信审核' : '主体审核'
              self.$message.success(msg + '已驳回！');
              self.asyncGetDataList();
            })
          }, function () {})
          .catch(function () {});
        },

        handleOperationColumn: function (name, data) {
          var fnMap = {
            'detail': this.showAuditDetail,
            'submit': this.handleSubmitOfOperation,
            'pass': this.handlePassOfOperation,
            'reject': this.handleRejectOfOperation,
          };

          var fn = fnMap[name];
          fn && fn(data);
        },

        handleConditionHided: function (prop) {
          this.formData[prop] = null;
        },

        statusToStateTagTypeMap: function (status) {
          var map = {
            WaitAudit: 'danger',
            SubmitedAudit: 'warning',
            RejectedAudit: 'info',
            ToSubmitVerification: 'info',
            ToVerification: 'danger',
            RejectedVerification: 'info',
            Completed: 'success',
          };
          return map[status];
        },

        submitOfOperation: function (status) {
          var allowStatus = ['WaitAudit'];
          return (allowStatus.indexOf(status) > -1);
        },

        passAndrejectOfOperation: function (status) {
          var allowStatus = ['SubmitedAudit', 'ToVerification'];
          return (allowStatus.indexOf(status) > -1);
        },

        handleOperationToggle: function (name, row) {
          var is = true;
          
          var operationMap = {
            'submit': this.submitOfOperation,
            'pass': this.passAndrejectOfOperation,
            'reject': this.passAndrejectOfOperation
          };

          var fn = operationMap[name];
          fn && (is = fn(row.Status));

          return is;
        },
      },

      template: `
          <el-card :body-style="{'min-height': '100%'}" >
              <ych-report-container>
                  <ych-report-header 
                      slot="header"
                      @hide-condition="handleConditionHided"
                      @query-click="queryBtnClick">

                      <ych-form-item 
                        label="日期"
                        key="CreateTime"
                        prop="CreateTime">
                        <el-date-picker
                          v-model="createTime"
                          type="daterange">
                        </el-date-picker>
                      </ych-form-item>

                      <ych-form-item 
                          label="主体"
                          key="CustomerName"
                          prop="CustomerName">
                          <el-input v-model="formData.CustomerName" clearable></el-input>
                      </ych-form-item>

                      <ych-form-item 
                          label="状态"
                          key="Status"
                          prop="Status">
                          <el-select v-model="formData.Status" clearable>
                              <el-option
                                  v-for="(name, key) in customerStatusEnum"
                                  :key="key"
                                  :label="name"
                                  :value="key">
                              </el-option>
                          </el-select>
                      </ych-form-item>
                      
                  </ych-report-header>

                  <ych-table
                      slot="main"
                      :data="dataList">

                      <ych-table-column-format
                          prop="SubmitTime"
                          label="提交时间"
                          format-type="date"
                          show-overflow-tooltip>
                      </ych-table-column-format>

                      <el-table-column
                          prop="CustomerNumber"
                          label="主体ID"
                          show-overflow-tooltip>
                      </el-table-column>
                      
                      <el-table-column
                          prop="CustomerAccount"
                          label="主体账号"
                          show-overflow-tooltip>
                      </el-table-column>
                      
                      <el-table-column
                          prop="CustomerName"
                          label="主体名称"
                          show-overflow-tooltip>
                      </el-table-column>

                      <el-table-column
                          prop="Status"
                          label="状态"
                          width="120"
                          show-overflow-tooltip>

                          <template slot-scope="scope">

                              <ych-state-tag
                                  :state="statusToStateTagTypeMap(scope.row.Status)"
                                  :text="customerStatusEnum[scope.row.Status] || '-'"
                              />
                              
                          </template>

                      </el-table-column>

                      <ych-table-column-operation
                          @operation-click="handleOperationColumn"
                          :toggle="handleOperationToggle"
                          :operation="columnOpration">
                      </ych-table-column-operation>
                      
                  </ych-table>

                  <ych-pagination
                      slot="footerRight"
                      @size-change="$_pagination_sizeChange"
                      @current-change="$_pagination_currentChange"
                      :current-page="paginationInfo.PageIndex"
                      :total="paginationTotal">
                  </ych-pagination>
              </ych-report-container>

              <el-dialog
                title="提示"
                width="550px"
                :visible.sync="dialogFormVisible"
                :close-on-click-modal="false"
                :close-on-press-escape="false">
                <div style="width: 70%;margin: 0 auto 20px auto;">
                  <p style="margin-bottom: 30px;">请填写该主题的"微信支付子商户号"与"支付宝PID号"</p>
                  <el-input
                    v-model="WeChatCustomerID"
                    placeholder="微信支付子商户号"
                    style="margin-bottom: 20px;"/>
                  <el-input
                    v-model="AlipayID"
                    placeholder="支付宝PID号"/>
                </div>
               
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="postWechatPass">确 定</el-button>
                </div>
              </el-dialog>
          </el-card>
        `
    }
  });
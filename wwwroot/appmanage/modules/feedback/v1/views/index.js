define([
  'mixins/pagination',
  'api/operation/v1/Feedback',
  'feedback/components/sidebar-feedback-detail',
], function (
  pagination,
  Feedback,
  SidebarFeedbackDetail
) {
    'use strict';

    // 操作列按钮
    var operationGroup = [
      {
        label: '查看',
        value: 'detail'
      }
    ];

    return {
      name: 'FeedbackList',
      components: {
      },

      mixins: [pagination],

      created: function () {
        // 初始化分页混合更新方法
        this.paginationUpdateFn = this.asyncGetDataList;

        this.asyncGetDataList();
      },

      data: function () {
        return {
          columnOpration: operationGroup,
          formData: {
            TimeStart: null,
            TimeEnd: null,
            FeedbackTel: null,
            Status: null
          },

          dataList: [],

          feedbackStatusEnum: {
            Read: '已读',
            Unread: '未读'
          },
        };
      },

      computed: {
        createTime: {
          get: function () {
            if (this.formData.TimeStart) {
              return [
                this.formData.TimeStart ? new Date(this.formData.TimeStart) : null,
                this.formData.TimeEnd ? new Date(this.formData.TimeEnd) : null,
              ];
            }

            return null;
          },

          set: function (val) {
            var time = val || [null, null];
            this.formData.TimeStart = time[0] || null;
            this.formData.TimeEnd = time[1] || null;
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

          Feedback
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
            this.formData.TimeStart 
            && this.formData.TimeStart === this.formData.TimeEnd
          ) {
            date.TimeEnd = this.$moment(this.formData.TimeEnd).second(59).minute(59).hour(23).valueOf();
          }

          return _.extend(
            {},
            this.formData,
            date,
            this.paginationInfo
          );
        },

        showFeedbackDetail: function (data) {
          var self = this,
            id = data.ID;

          this.sideBar({
            title: '意见反馈',
            datas: {
              id: id
            },
            modules: [{
              component: SidebarFeedbackDetail
            }]
          }).show();
        },

        handleOperationColumn: function (name, data) {
          var fnMap = {
            'detail': this.showFeedbackDetail
          };

          var fn = fnMap[name];
          fn && fn(data);
        },

        handleConditionHided: function (prop) {
          this.formData[prop] = null;
        },

        statusToStateTagTypeMap: function (status) {
          var map = {
            Read: 'info',
            Unread: 'warning',
          };
          return map[status];
        },

      },

      template: `
        <el-card :body-style="{'min-height': '100%'}" >
            <ych-report-container>
                <ych-report-header 
                    slot="header"
                    @hide-condition="handleConditionHided"
                    @query-click="asyncGetDataList">

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
                        label="反馈人"
                        key="FeedbackTel"
                        prop="FeedbackTel">
                        <el-input 
                          v-model="formData.FeedbackTel" 
                          placeholder="请输入反馈人手机号"
                          clearable></el-input>
                    </ych-form-item>

                    <ych-form-item 
                        label="状态"
                        key="Status"
                        prop="Status">
                        <el-select v-model="formData.Status" clearable>
                            <el-option
                                v-for="(name, key) in feedbackStatusEnum"
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
                        prop="CreateTime"
                        label="反馈时间"
                        format-type="date"
                        show-overflow-tooltip>
                    </ych-table-column-format>
                    
                    <el-table-column
                        prop="Telphone"
                        label="反馈人"
                        width="150"
                        show-overflow-tooltip>
                    </el-table-column>
                    
                    <el-table-column
                        prop="StoreName"
                        label="反馈门店"
                        width="150"
                        show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column
                        prop="Content"
                        label="反馈内容"
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
                                :text="feedbackStatusEnum [scope.row.Status] || '-'"
                            />
                        </template>
                    </el-table-column>
                        
                    <ych-table-column-operation
                        @operation-click="handleOperationColumn"
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
        </el-card>
      `
    }
  });
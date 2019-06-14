define([
  'mixins/pagination',
  'api/operation/v1/Customer',
  'customer/components/sidebar-customer-audit',
  'customer/components/sidebar-customer-add'
], function (
  pagination,
  Customer,
  SidebarCustomerAudit,
  SidebarCustomerAdd
) {
    'use strict';

    // 操作列按钮
    var operationGroup = [
      {
        label: '编辑',
        value: 'edit'
      }
    ];

    return {
      name: 'CustomerList',

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
            CreateTimeStart: null,
            CreateTimeEnd: null,
            CustomerName: null,
            Status: null
          },

          dataList: [],

          customerStatusEnum: {
            Opening: '营业中',
            NotInformation: '未完善资料',
          }

        };
      },

      computed: {
        createTime: {
          get: function () {
            if (this.formData.CreateTimeStart) {
              return [
                this.formData.CreateTimeStart ? new Date(this.formData.CreateTimeStart) : null,
                this.formData.CreateTimeEnd ? new Date(this.formData.CreateTimeEnd) : null,
              ];
            }

            return null;
          },

          set: function (val) {
            var time = val || [null, null];
            this.formData.CreateTimeStart = time[0] || null;
            this.formData.CreateTimeEnd = time[1] || null;
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

          Customer
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
            this.formData.CreateTimeStart 
            && this.formData.CreateTimeStart === this.formData.CreateTimeEnd
          ) {
            date.CreateTimeEnd = this.$moment(this.formData.CreateTimeEnd).second(59).minute(59).hour(23).valueOf();
          }

          return _.extend(
            {},
            this.formData,
            date,
            this.paginationInfo
          );
        },

        showCustomerDetail: function (data) {
          var self = this,
            id = data.ID;

          this.sideBar({
            title: '客户资料',
            datas: {
              id: id
            },
            operation: [{
              label: '保存',
              value: 'save'
            }],
            modules: [{
              component: SidebarCustomerAudit
            }]
          }).show();
        },

        handleOperationColumn: function (name, data) {
          var fnMap = {
            'edit': this.showCustomerDetail,
          };

          var fn = fnMap[name];
          fn && fn(data);
        },

        handleConditionHided: function (prop) {
          this.formData[prop] = null;
        },

        statusToStateTagTypeMap: function (status) {
          var map = {
            Opening: 'success',
            NotInformation: 'danger'
          };
          return map[status];
        },

        handleOperationToggle: function (name, row) {
          var is = true;
          if (name === 'on') {
            is = (row.Status === 'Disabled');
          } else if (name === 'off') {
            is = (row.Status !== 'Disabled');
          }

          return is;
        },

        addCustomer: function () {
          this.sideBar({
            title: '新增客户',
            operation: [{
              label: '保存',
              value: 'save'
            }],
            modules: [{
              component: SidebarCustomerAdd
            }]
          }).show();
        },

        handleOperationToggle: function (name, row) {
          var is = true;

          // if(name === 'edit' && row.ID.substr(0, 4) === '0000') {
          //   is = false
          // }
          
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

                      <el-table-column
                          prop="CustomerCode"
                          label="主体ID"
                          width="150"
                          show-overflow-tooltip>
                      </el-table-column>
                      
                      <el-table-column
                          prop="CustomerAccount"
                          label="主体账号"
                          width="150"
                          show-overflow-tooltip>
                      </el-table-column>
                      
                      <el-table-column
                          prop="CustomerName"
                          label="主体名称"
                          width="150"
                          show-overflow-tooltip>
                      </el-table-column>

                      <ych-table-column-format
                          prop="StoreAmount"
                          label="门店数量"
                          width="150"
                          format-type="number"
                          show-overflow-tooltip>
                      </ych-table-column-format>

                      <ych-table-column-format
                          prop="DeviceAmount"
                          label="设备数量"
                          width="150"
                          format-type="number"
                          show-overflow-tooltip>
                      </ych-table-column-format>

                      <ych-table-column-format
                          prop="LeaguerAmount"
                          label="会员数量"
                          width="150"
                          format-type="number"
                          show-overflow-tooltip>
                      </ych-table-column-format>

                      <el-table-column
                          prop="Status"
                          label="营业状态"
                          width="120"
                          show-overflow-tooltip>

                          <template slot-scope="scope">

                              <ych-state-tag
                                  :state="statusToStateTagTypeMap(scope.row.Status)"
                                  :text="customerStatusEnum[scope.row.Status] || '-'"
                              />
                              
                          </template>

                      </el-table-column>

                      <el-table-column
                          prop="WechatAccount"
                          label="绑定小程序"
                          width="150"
                          show-overflow-tooltip>
                      </el-table-column>

                      <!-- <ych-table-column-format
                          prop="MonthRevenue"
                          label="本月营业"
                          width="150"
                          format-type="currency"
                          show-overflow-tooltip>
                      </ych-table-column-format>

                      <ych-table-column-format
                          prop="TotalRevenue"
                          label="总额业额"
                          width="150"
                          format-type="currency"
                          show-overflow-tooltip>
                      </ych-table-column-format> -->

                      <ych-table-column-format
                          prop="RealityOpenDays"
                          label="实际营业天数"
                          width="150"
                          format-type="number"
                          show-overflow-tooltip>
                      </ych-table-column-format>

                      <ych-table-column-format
                          prop="CreatedTime"
                          label="创建时间"
                          format-type="date"
                          show-overflow-tooltip>
                      </ych-table-column-format>
 
                      <ych-table-column-operation
                          @operation-click="handleOperationColumn"
                          :toggle="handleOperationToggle"
                          :operation="columnOpration">
                      </ych-table-column-operation>
                      
                  </ych-table>

                  <template slot="footerLeft">
                    <ych-button
                      @click="addCustomer"
                      type="primary">
                      新增客户
                    </ych-button>
                  </template>

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
define([
  'framework/mixins/sidebar-form',
  'mixins/pagination',
  'api/operation/v1/Device'
], function (
  sideBarForm,
  pagination,
  Device
) {
    'use strict';

    return {
      name: 'SidebarDeviceDetail',

      mixins: [sideBarForm, pagination],

      created: function () {
        this.asyncGetDeviceDetail();
        this.asyncGetDeviceRunLog();

        // 初始化分页混合更新方法
        this.paginationUpdateFn = this.asyncGetDeviceRunLog;
      },

      data: function () {
        return {
          formData: {
            ID: null,
            Code: null,
            TypeName: null,
            Version: null,
            AssetsVersion: null,
            Status: null,
            BindCustomerName: null,
            LeaveFactoryTime: null,
            BindTime: null,
            LastExpendTime: null,
            LastOnlineTime: null,
            NetowrkIP: null,
            RepeatConnectionTimesToday: null,
            StrengthOfNetwork: null,
            DelayOfNetwork: null,
            SubChipVersions: [],
          },

          dataList: [],

          deviceStatusEnum: {
            Online: '在线',
            Fault: '故障',
            Offline: '离线',
            Disabled: '停用'
          },

          logType: {
            Info: '信息',
            Error: '错误'
          }
        }
      },

      computed: {
        id: function () {
          return this.incomingData.id;
        }
      },

      methods: {
        asyncGetDeviceDetail: function () {
          var self = this;
          Device
            .Detail({ ID: this.id })
            .then(function (data) {
              _.assign(self.formData, data);
            });
        },

        // 处理提交数据
        handleSubmitData: function () {
          return _.extend(
            {},
            { ID: this.id },
            this.paginationInfo
          );
        },

        asyncGetDeviceRunLog: function () {
          var self = this;
          Device
            .RunLog(this.handleSubmitData())
            .then(function (data) {
              self.dataList = data.List;
              self.paginationTotal = data.Total;
            });
        }
      },

      template: `
        <el-tabs activeName="info">
            <el-tab-pane 
              label="基础信息"
              name="info">
              <ych-sidebar-layout>
                <ych-form
                  :data="formData">

                  <el-form-item prop="Code" label="设备编码">
                    <el-input :value="formData.Code" disabled/>
                  </el-form-item>

                  <el-form-item prop="TypeName" label="设备类型">
                    <el-input :value="formData.TypeName" disabled/>
                  </el-form-item>

                  <el-form-item prop="Version" label="安装包版本">
                    <el-input :value="formData.Version" disabled/>
                  </el-form-item>

                  <el-form-item prop="AssetsVersion" label="资源包版本">
                    <el-input :value="formData.AssetsVersion" disabled/>
                  </el-form-item>

                  <el-form-item
                    v-for="item in formData.SubChipVersions"
                    :key="item.ChipName"
                    prop="SubChipVersions"
                    :label="item.ChipName">
                    <el-input :value="item.Version" disabled/>
                  </el-form-item>

                  <el-form-item prop="Status" label="设备状态">
                    <el-input :value="deviceStatusEnum[formData.Status]" disabled/>
                  </el-form-item>

                  <el-form-item prop="BindCustomerName" label="绑定主体">
                    <el-input :value="formData.BindCustomerName" disabled/>
                  </el-form-item>

                  <el-form-item prop="BindTenantName" label="绑定门店">
                    <el-input :value="formData.BindTenantName" disabled/>
                  </el-form-item>

                  <el-form-item prop="LeaveFactoryTime" label="出厂时间">
                    <el-input :value="formData.LeaveFactoryTime | timeFormate" disabled/>
                  </el-form-item>

                  <el-form-item prop="BindTime" label="绑定时间">
                    <el-input :value="formData.BindTime | timeFormate" disabled/>
                  </el-form-item>

                  <el-form-item prop="LastExpendTime" label="最后消费时间">
                    <el-input :value="formData.LastExpendTime | timeFormate" disabled/>
                  </el-form-item>

                  <el-form-item prop="LastOnlineTime" label="最后在线时间">
                    <el-input :value="formData.LastOnlineTime | timeFormate" disabled/>
                  </el-form-item>

                  <el-form-item prop="NetowrkIP" label="路由外网ip">
                    <el-input :value="formData.NetowrkIP" disabled/>
                  </el-form-item>

                  <el-form-item prop="RepeatConnectionTimesToday" label="今日重连次数">
                    <el-input :value="formData.RepeatConnectionTimesToday" disabled/>
                  </el-form-item>

                  <el-form-item prop="StrengthOfNetwork" label="网络强度">
                    <el-input :value="formData.StrengthOfNetwork" disabled/>
                  </el-form-item>

                  <el-form-item prop="DelayOfNetwork" label="网络延迟">
                    <el-input :value="formData.DelayOfNetwork" disabled/>
                  </el-form-item>

                </ych-form>
              </ych-sidebar-layout>

            </el-tab-pane>

            <el-tab-pane 
              label="运行日志"
              name="runlog">
              
              <ych-sidebar-layout>
                <ych-report-container>
                    <ych-table
                        slot="main"
                        :data="dataList">

                        <ych-table-column-format
                            prop="RecordTime"
                            label="设备编码"
                            width="150"
                            format-type="date">
                        </ych-table-column-format>
                        
                        <el-table-column
                          prop="LogType"
                          label="设备状态"
                          width="120"
                          show-overflow-tooltip>

                          <template slot-scope="scope">
                            {{ logType[scope.row.LogType] }}
                          </template>

                        </el-table-column>
                        
                        <el-table-column
                            prop="Remarks"
                            label="说明"
                            show-overflow-tooltip>
                        </el-table-column>
                    </ych-table>

                    <ych-pagination
                        slot="footerRight"
                        @size-change="$_pagination_sizeChange"
                        @current-change="$_pagination_currentChange"
                        :current-page="paginationInfo.PageIndex"
                        :total="paginationTotal">
                    </ych-pagination>
                </ych-report-container>
              </ych-sidebar-layout>
            </el-tab-pane>
        </el-tabs>
      `
    }
  });
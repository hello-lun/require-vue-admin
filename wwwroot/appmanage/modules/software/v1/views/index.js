define([
    'mixins/pagination',
    'api/operation/v1/Software',
    'api/operation/v1/DeviceType',
    'software/components/sidebar-software-add',
    'software/components/sidebar-updated-list',
    'software/components/sidebar-level-test',
], function (
    pagination,
    Software,
    DeviceType,
    SidebarSoftwareAdd,
    SidebarUpdatedList,
    SidebarLevelTest,
    ) {
        'use strict';

        // 操作列按钮
        var operationGroup = [
            {
                label: '全网升级',
                value: 'update'
            },
            {
                label: '灰度测试',
                value: 'test'
            }
        ];

        return {
            name: 'GoodsList',
            components: {
            },

            mixins: [pagination],

            created: function () {
                // 初始化分页混合更新方法
                this.paginationUpdateFn = this.asyncGetDataList;

                this.asyncGetDataList();
                this.asyncGetDeviceList();
            },

            data: function () {
                return {
                    columnOpration: operationGroup,
                    // Online Disable MentionCoin
                    formData: {
                        DeviceType: null,
                        Status: null,
                        Name: null
                    },

                    dataList: [],

                    deviceList: [],

                    deviceStatusEnum: {
                        Online: '在线',
                        Disable: '停用'
                    },

                    deviceAmount: 0
                };
            },

            computed: {
                tableTitle: function () {
                    return `设备总数： ${this.deviceAmount}`;
                }
            },

            methods: {
                queryBtnClick: function () {
                    this.paginationInfo.PageIndex = 1;
                    this.asyncGetDataList();
                },
                asyncGetDataList: function () {
                    var self = this;

                    this.$nextTick(function () {

                        Software
                            .List(self.handleSubmitData())
                            .then(function (data) {
                                self.dataList = data.List;
                                self.deviceAmount = data.DeviceAmount;
                                self.paginationTotal = data.Total;
                            });
                    });
                },

                // 处理提交数据
                handleSubmitData: function () {
                    return _.extend(
                        {},
                        this.formData,
                        this.paginationInfo
                    );
                },

                asyncGetDeviceList: function () {
                    var self = this;

                    DeviceType
                        .List()
                        .then(function (data) {
                            self.deviceList = data.List || [];
                        });
                },

                showUpdatedDevice: function (data) {
                    var self = this,
                        id = data.ID;

                    this.sideBar({
                        title: data.Name + ' - 已更新设备列表',
                        datas: {
                            id: id
                        },
                        modules: [{
                            component: SidebarUpdatedList
                        }]
                    }).show();
                },

                pushTest: function (data) {
                    var self = this,
                        id = data.ID;

                    this.sideBar({
                        title: data.Name + ' - 灰度测试列表',
                        datas: {
                            id: id
                        },
                        modules: [{
                            component: SidebarLevelTest
                        }],
                        operation: [{
                            label: '推送升级',
                            value: 'push'
                        }],
                        success: function () {
                            self.asyncGetDataList();
                        }
                    }).show();
                },

                // 全网推送升级
                pushUpdate: function (data) {
                    var self = this;

                    this.$confirm('您现在即将进行全网升级操作，该操作可能影响客户正常经营，确定要全网推送升级？', '全网升级推送', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function () {
                        return Software.Push({
                            ID: data.ID,
                            IsFull: true,
                        }).then(function () {
                            self.$alert(
                                '升级将于设备启动后首次联网进行静默升级，升级期间将影响正常使用！',
                                '推送成功',
                                { type: 'success' }
                            );
                        })
                    }).catch(function () { });
                },

                handleOperationColumn: function (name, data) {
                    var fnMap = {
                        'update': this.pushUpdate,
                        'test': this.pushTest
                    };

                    var fn = fnMap[name];
                    fn && fn(data);
                },

                handleConditionHided: function (prop) {
                    this.formData[prop] = null;
                },

                addSoftware: function () {
                    var self = this;

                    this.sideBar({
                        title: '软件管理 - 新增',

                        modules: [{
                            component: SidebarSoftwareAdd
                        }],
                        operation: [{
                            label: '上传',
                            value: 'add'
                        }],
                        success: function () {
                            self.asyncGetDataList();
                        }
                    }).show();
                }
            },

            template: `
              <el-container 
                  :body-style="{'width': '220px'}" 
                  style="min-height: 100%;">

                  <el-card :body-style="{'height': '100%'}" >
                      <ych-report-container>
                          <ych-report-header 
                              slot="header"
                              @hide-condition="handleConditionHided"
                              @query-click="queryBtnClick">

                              <ych-form-item 
                                  label="适用设备"
                                  key="DeviceType"
                                  prop="DeviceType">
                                  <el-select v-model="formData.DeviceType" clearable>
                                      <el-option
                                          v-for="item in deviceList"
                                          :key="item.Code"
                                          :label="item.Name"
                                          :value="item.Code">
                                      </el-option>
                                  </el-select>
                              </ych-form-item>

                              <ych-form-item 
                                  label="固件状态"
                                  key="Status"
                                  prop="Status">
                                  <el-select v-model="formData.Status" clearable>
                                      <el-option
                                          v-for="(name, key) in deviceStatusEnum"
                                          :key="key"
                                          :label="name"
                                          :value="key">
                                      </el-option>
                                  </el-select>
                              </ych-form-item>

                              <ych-form-item  
                                  label="固件名称" 
                                  key="Name"
                                  prop="Name">
                                  <el-input v-model="formData.Name" clearable></el-input>
                              </ych-form-item >
                              
                          </ych-report-header>

                          <ych-table
                              slot="main"
                              :data="dataList">

                              <el-table-column
                                  :label="tableTitle">

                                  <el-table-column
                                      type="index"
                                      label="序号"
                                      align="center">
                                  </el-table-column>

                                  <el-table-column
                                      prop="Name"
                                      label="软件名称"
                                      width="100"
                                      show-overflow-tooltip>
                                  </el-table-column>
                                  
                                  <el-table-column
                                      prop="Version"
                                      label="软件版本号"
                                      width="100"
                                      show-overflow-tooltip>
                                  </el-table-column>
                                  
                                  <el-table-column
                                      prop="DeviceTypeName"
                                      label="适用设备类型"
                                      width="100"
                                      show-overflow-tooltip>
                                  </el-table-column>

                                  <el-table-column
                                      prop="Status"
                                      label="软件状态"
                                      width="100"
                                      show-overflow-tooltip>
                                      <template slot-scope="scope">
                                          {{ deviceStatusEnum[scope.row.Status] || '-' }}
                                      </template>
                                  </el-table-column>
                                  
                                  <ych-table-column-format
                                      prop="ReleaseDate"
                                      label="发布日期"
                                      format-type="date">
                                  </ych-table-column-format>

                                  <el-table-column
                                      prop="Remarks"
                                      label="软件说明"
                                      width="310"
                                      show-overflow-tooltip>
                                  </el-table-column>

                                  <ych-table-column-format
                                      prop="UpdatedAmount"
                                      label="已更新设备数"
                                      width="100"
                                      format-type="link"
                                      :link-click="showUpdatedDevice">
                                  </ych-table-column-format>
                                  
                              </el-table-column>

                              <ych-table-column-operation
                                  @operation-click="handleOperationColumn"
                                  :operation="columnOpration">
                              </ych-table-column-operation>
                              
                          </ych-table>

                          <template slot="footerLeft">
                              <ych-button
                                  @click="addSoftware"
                                  type="primary">
                                  新增软件版本
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
              </el-container>
          `
        }
    });
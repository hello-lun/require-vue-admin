define([
  'framework/mixins/sidebar-form',
  'api/operation/v1/Customer',
  'api/operation/v1/Assets',
  'components/area/index'
], function (
  sideBarForm,
  Customer,
  Assets,
  area
) {
    'use strict';

    return {
      name: 'SidebarLevelTest',

      mixins: [sideBarForm],

      components: {
        YchArea: area
      },

      created: function () {
        this.formData.VersionID = this.incomingData.id;
        // 初始化分页混合更新方法
        // this.paginationUpdateFn = this.loadMoreCustomer;

        this.loadMoreCustomer();
      },

      data: function () {
        return {
          formData: {
            VersionID: '',
            UpdateType: 'Assets',
            DeviceStatus: 'NotUpdate',
            Customer: null,
            Province: null,
            City: null,
            County: null
          },

          dataList: [],

          deviceTotal: 0,

          selectedRow: []
        }
      },

      computed: {
        areaData: {
          get: function () {
            return [
              this.formData.Province,
              this.formData.City,
              this.formData.County,
            ];
          },

          set: function (val) {
            this.formData.Province = val[0] || null;
            this.formData.City = val[1] || null;
            this.formData.County = val[2] || null;
          }
        },

        idsOfSelectedRows: function () {
          return _.map(this.selectedRow, function (item) {
            return item.ID;
          }) || [];
        }
      },

      methods: {
        // 推送升级
        push: function () {
          var self = this;
          return new Promise(function (resolve, reject) {
            var ids = self.handleIdsOfSelectedRows();
            if (ids.length === 0) {
              self.$message.error('请选择需要推送升级的主体');
              return reject();
            }

            self.$confirm('您现在即将灰度测试推送操作，该操作可能影响客户正常经营，确定要全网推送升级？', '灰度测试', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(function () {
              Assets.Push({
                ID: self.formData.VersionID,
                Customers: ids,
                IsFull: false
              }).then(function () {
                self.$alert(
                  '升级将于设备启动后首次联网进行静默升级，升级期间将影响正常使用！',
                  '推送成功',
                  { type: 'success', callback: function () { resolve() } }
                );
              }, function () {
                reject();
              })
            }).catch(function () { reject() });
          });
          
        },

        loadMoreCustomer: function () {
          var self = this;

          Customer
            .ListByArea(this.formData)
            .then(function (data) {
              self.dataList = data.List;
              self.deviceTotal = data.Total;
            });
        },

        handleSelectionChange: function (val) {
          this.selectedRow = val;
        },

        handleIdsOfSelectedRows: function () {
          return _.map(this.selectedRow, function (item) {
            return item.ID;
          }) || [];
        }
      },

      template: `
        <ych-sidebar-layout >
          <ych-report-container>
            <ych-report-header 
              slot="header"
              :setting-toggle="false"
              @query-click="loadMoreCustomer">

              <ych-form-item 
                  label="地区"
                  key="DeviceType"
                  label-width="3em"
                  prop="DeviceType">

                  <ych-area v-model="areaData">
                  </ych-area>
              </ych-form-item>

              <ych-form-item  
                  label="主体" 
                  key="Customer"
                  label-width="3em"
                  prop="Customer">
                  <el-input 
                    v-model="formData.Customer" 
                    placeholder="请输入主体关键进行搜索"
                    clearable>
                  </el-input>
              </ych-form-item>
            </ych-report-header>

            <el-table
              slot="main"
              @selection-change="handleSelectionChange"
              row-key="ID"
              :data="dataList">

              <el-table-column
                type="selection"
                :label="'(' + deviceTotal + ')'"
                align="center">
              </el-table-column>

              <el-table-column
                prop="Name"
                label="主体"
                show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                prop="Contact"
                label="联系方式"
                width="120"
                show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                prop="StoreAmount"
                label="门店"
                width="100"
                show-overflow-tooltip>
              </el-table-column>

              <el-table-column
                prop="DeviceAmount"
                label="设备数量"
                width="100"
                show-overflow-tooltip>
              </el-table-column>

            </el-table>
                
          </ych-report-container>
        </ych-sidebar-layout>
      `
    }
  }
);

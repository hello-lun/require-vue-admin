define([
  'framework/mixins/sidebar-form',
  'mixins/pagination',
  'api/operation/v1/Assets',
  'components/area/index'
], function (
  sideBarForm,
  pagination,
  Assets,
  area
) {
    'use strict';

    return {
      name: 'SidebarUpdatedList',

      mixins: [ sideBarForm, pagination ],

      components: {
        YchArea: area
      },

      created: function () {
        this.formData.ID = this.incomingData.id;
        // 初始化分页混合更新方法
        this.paginationUpdateFn = this.asyncGetUpdatedList;

        this.asyncGetUpdatedList();
      },

      data: function () {
        return {
          formData: {
            ID: '',
            Customer: null,
            Province: null,
            City: null,
            County: null
          },

          dataList: []
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
        }
      },

      methods: {
        asyncGetUpdatedList: function () {
          var self = this;

          Assets
            .UpdatedList(this.formData)
            .then(function (data) {
              self.dataList = data.List;
              self.paginationTotal = data.Total;
            })
        }
      },

      template: `
        <ych-sidebar-layout >
          <ych-report-container>
            <ych-report-header 
              slot="header"
              :setting-toggle="false"
              @query-click="asyncGetUpdatedList">

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

            <ych-table
              slot="main"
              :data="dataList">

              <el-table-column
                type="index"
                label="序号"
                align="center">
              </el-table-column>

              <el-table-column
                prop="Customer"
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
                prop="UpdatedAmount"
                label="已更新设备"
                width="100"
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
      `
    }
  });
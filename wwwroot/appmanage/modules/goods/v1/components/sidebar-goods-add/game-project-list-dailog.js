define([
  'mixins/pagination',
  'api/game-project/v1/GameProject',
  'components/cascader-game-project-type/index'
], function (
  pagination,
  GameProject,
  cascaderGameProjectType
) {
    'use strict';

    return {
      name: 'GameProjectListDailog',

      mixins: [pagination],
      
      components: {
        CascaderGameProjectType: cascaderGameProjectType
      },

      props: {
        visible: {
          type: Boolean,
          default: false
        },

        selected: {
          type: Array,
          default: function () {
            return [];
          }
        }
      },

      created: function () {
        // 初始化分页混合更新方法
        this.paginationUpdateFn = this.asyncGetGameProject;
      },

      data: function () {
        return {
          dataList: [],

          formData: {
            ProjectName: null,
            ProjectTypeID: [],
            ProjectCode: null
          },

          multipleSelection: [],

          loading: false
        };
      },

      watch: {
        'visible': function (val) {
          val
            ? this.asyncGetGameProject()
            : this.initDialog();
        }
      },

      computed: {
        localVisible: {
          get: function () {
            return this.visible;
          },

          set: function (val) {
            this.$emit('update:visible', val);
          }
        },

        loadmoreBtnText: function () {
          return this.loading
            ? '加载中...'
            : this.loadmoreBtnDisabled
              ? '没有更多了'
              : '加载更多';
        },

        loadmoreBtnDisabled: function () {
          return this.paginationTotal <= this.dataList.length;
        }
      },

      methods: {
        asyncGetGameProject: function () {
          var self = this;

          var failFn = function () {
            self.loading = false;
            self.paginationInfo.PageIndex--;
          }

          this.$nextTick(function () {
            var submitData = self.handleSubmitData();
            self.loading = true;

            GameProject
              .GetProjectDataList(submitData)
              .then(function (res) {
                self.loading = false;

                self.dataList = _.concat(
                  self.dataList,
                  res.Data
                );

                self.paginationTotal = res.Total;
              }, function () {
                failFn();
              })
              .catch(function () {
                failFn();
              })
          });
        },

        handleQueryEvent: function () {
          this.clearData();
          this.asyncGetGameProject();
        },

        clearData: function () {
          this.dataList = [];
          this.multipleSelection = [];
          _.extend(this.paginationInfo, {
            PageSize: 20,
            PageIndex: 1
          });
          this.paginationTotal = 0;
        },

        initDialog: function () {
          this.clearData();
          _.assign(this.formData, {
            ProjectName: null,
            ProjectTypeID: [],
            ProjectCode: null
          });
        },

        handleSubmitData: function () {
          var baseData = _.assign({}, this.formData);
          baseData.ProjectTypeID = _.last(baseData.ProjectTypeID);
          return _.extend(
            {},
            baseData,
            this.paginationInfo,
            { NoInIDs: this.selected }
          );
        },

        loadmore: function () {
          var index = this.paginationInfo.PageIndex + 1;
          this.$_pagination_currentChange(index);
        },

        handleSelectedData: function () {
          var selectedRow = _.concat([], this.multipleSelection);

          this.localVisible = false;

          this.$emit('submit', selectedRow);
        },

        handleTableClose: function () {
          this.dataList = [];
        }
      },

      template: `
          <el-dialog
              title="选择套票可用项目"
              width="700px"
              @close="handleTableClose"
              :visible.sync="localVisible"
              :lock-scroll="false"
              :modal-append-to-body="false">
              <ych-report-container>
                  <ych-report-header 
                      slot="header"
                      :setting-toggle="false"
                      @query-click="handleQueryEvent">

                      <ych-form-item 
                          key="ProjectName"
                          prop="ProjectName"
                          label="项目名称">
                          <el-input 
                              v-model="formData.ProjectName"></el-input>
                      </ych-form-item>

                      <ych-form-item 
                          key="ProjectCode"
                          prop="ProjectCode"
                          label="项目编号">
                          <el-input 
                              v-model="formData.ProjectCode"></el-input>
                      </ych-form-item>

                      <ych-form-item 
                          key="ProjectTypeID"
                          prop="ProjectTypeID"
                          label="项目类型">

                          <cascader-game-project-type v-model="formData.ProjectTypeID">
                          </cascader-game-project-type>
                      </ych-form-item>

                  </ych-report-header>

                  <ych-table
                      slot="main"
                      :data="dataList"
                      row-key="ID"
                      :column-controller="false"
                      @selection-change="multipleSelection = arguments[0]"
                      :height="350">

                      <el-button 
                          slot="append"
                          :loading="loading"
                          :disabled="loadmoreBtnDisabled"
                          type="info"
                          @click="loadmore"
                          style="width: 100%; border-radius:0;border: 0;"
                          plain>
                          {{ loadmoreBtnText }}
                      </el-button>

                      <el-table-column
                          prop="Name"
                          label="项目名称">
                      </el-table-column>

                      <el-table-column
                          prop="Code"
                          label="项目编号"
                          width="120">
                      </el-table-column>
                      
                      <el-table-column
                          prop="ProjectTypeName"
                          label="项目类型"
                          min-width="120">
                      </el-table-column>

                      <el-table-column
                          type="selection"
                          width="45">
                      </el-table-column>
                  </ych-table>

              </ych-report-container>

              <span slot="footer">
                  <ych-button 
                      @click="localVisible = false">
                      取 消
                  </ych-button>
                  <ych-button 
                      type="primary" 
                      @click="handleSelectedData">
                      确 定
                  </ych-button>
              </span>
          </el-dialog>
      `
    }
  });
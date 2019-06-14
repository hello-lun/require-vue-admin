define([
  'api/goods/v1/GoodsGroup'
], function(
  goodsGroup
) {
  'use strict';
  
  return {
    name: 'ViewDropdown',
    
    created: function () {
      this.fetchGoodsViews();
    },
    
    data: function () {
      return {
        // 当前视图信息
        currentView: {
          ID: '',
          Name: ''
        },
        // 下拉显示状态
        dropdownStatus: false,
        // 视图列表
        views: [],
        // 在编辑中的视图
        editViews: [],
        // 临时存放视图名，
        // 用于在视图编辑未保存的状态下关闭下拉框时，恢复原值
        viewsNameTemp: {},
        savingViews: [],
        adding: false
      };
    },

    methods: {
      fetchGoodsViews: function () {
        var self = this;
        goodsGroup
          .GetAllView()
          .then(function (data) {
            var views = _.map(
              data.Data || [], 
              function (item, index) {
                index === 0 && (item.default = true);
                return item;
              }
            );
            
            self.setCurrentView(views[0]);
            
            self.views = views;
          });
      },

      setCurrentView: function (view) {
        view = view || {}
        _.assign(this.currentView, view);
        this.$emit('change', view);
      },

      handleViewEdit: function (view) {
        this.editViews.push(view.ID);
        this.viewsNameTemp[view.ID] = view.Name;
      },

      handleViewDelete: function (id, index) {
        var self = this;
        this.$confirm('此操作将同时移除该分组内所展示的商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          goodsGroup
            .DeleteGoodsGroup({
              ViewIDs: [id]
            })
            .then(function () {
              self.views.splice(index, 1);
              self.$message({
                message: '商品视图删除成功！',
                type: 'success'
              });
            })
        }).catch();
      },

      handleDropdownVisible: function (is) {
        this.dropdownStatus = is;
        if (!is) {
          this.editViews = [];
          this.resetViews();
        }
      },

      resetViews: function () {
        var self = this;
        _.forEach(this.views, function (item, index) {
          if (self.viewsNameTemp[item.ID]) {
            item.Name = self.viewsNameTemp[item.ID];
            delete self.viewsNameTemp[item.ID];
          }
          if(!item.ID) {
            self.views.splice(index, 1);
          }

          self.adding = false;
        });
      },

      saveGoodsView: function (view) {
        // 保存中...
        if (this.savingViews.indexOf(view.ID) > -1) {
          return;
        }

        if (!view.ID) {
          return this.saveNewGoodsView(view);
        }

        this.savingViews.push(view.ID);

        var removeFn = function () {
          self.savingViews.splice(self.savingViews.indexOf(view.ID), 1);
        }

        var self = this;
        goodsGroup
          .EditGoodsGroup(view)
          .then(function (res) {
            self.$message({
              message: '商品视图保存成功！',
              type: 'success'
            });
            self.editViews.splice(self.editViews.indexOf(view.ID), 1);
            removeFn();
          }, function () {
            removeFn();
          }).catch(function () {
            removeFn();
          });
      },

      addGoodsViewRow: function () {
        this.views.push({
          ID: '',
          Name: ''
        })
      },

      saveNewGoodsView: function (newView) {
        var self = this;

        goodsGroup
          .AddGoodsGroup({
            Name: newView.Name
          })
          .then(function (res) {
            self.$message({
              message: '商品视图添加成功！',
              type: 'success'
            });
            newView.ID = res.ID;
            self.adding = false;
          });
      },

      handleDropdowCommand: function (data) {
        if (data === 'plus') {
          this.adding = true;
          return this.addGoodsViewRow();
        }
        // 编辑中
        if (!data.ID || this.editViews.indexOf(data.ID) > -1) {
          return;
        }

        this.setCurrentView(data);
        this.$refs.dropdown.visible = false;
      }
    },
    template: `
      <el-dropdown 
        ref="dropdown"
        trigger="click"
        size="small"
        class="goods-view-setting__header"
        :hide-on-click="false"
        @visible-change="handleDropdownVisible"
        @command="handleDropdowCommand">
        <div class="goods-view-setting__dropdown">
          {{ currentView.Name }}
          <i 
            class="el-icon--right"
            :class="[dropdownStatus ? 'el-icon-arrow-up' :  'el-icon-arrow-down']">
          </i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in views"
            :key="item.ID"
            :command="item"
            class="goods-view-setting__dropdown-item">
            <div v-show="item.ID && editViews.indexOf(item.ID) < 0" class="goods-view-setting__dropdown-item-row">
              <div class="goods-view-setting__view-name">
                <span class="single-ellipsis">{{ item.Name }}</span>
              </div>
              <div v-if="index !== 0" class="goods-view-setting__view-btns">
                <el-button 
                    type="text"
                    @click.stop="handleViewEdit(item)"
                    icon="el-icon-edit-outline">
                  </el-button>
                  <el-button 
                    @click.stop="handleViewDelete(item.ID, index)"
                    type="text" 
                    icon="el-icon-delete color-danger">
                  </el-button>
              </div>
            </div>

            <div v-show="editViews.indexOf(item.ID) > -1 || !item.ID">
              <el-input
                v-model="item.Name"
                size="mini"
                :disabled="savingViews.indexOf(item.ID) > -1">
                <i 
                  @click="saveGoodsView(item)"
                  slot="suffix" 
                  class="el-input__icon color-primary"
                  :class="savingViews.indexOf(item.ID) > -1 ? 'el-icon-loading' : 'el-icon-check'">
                </i>
              </el-input>
            </div>
          </el-dropdown-item>

          <el-dropdown-item
            v-show="!adding"
            command="plus"
            class="goods-view-setting__dropdown-item goods-view-setting__dropdown-item--plus"
            key="default">
            <i class="el-icon-plus"></i>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    `
  }
});
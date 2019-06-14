define([
  'api/goods/v1/GoodsGroup',
  'goods/components/goods-sale-view/view-dropdown'
], function (
  goodsGroup,
  viewDropdown
) {
    'use strict';

    return {
      name: 'GoodsSaleViewSetting',

      components: {
        ViewDropdown: viewDropdown
      },

      computed: {
        // 当前视图是否为默认视图
        isDefaultView: function () {
          return (this.currentView || {}).default || false;
        },

        treeInstance: function () {
          return this.$refs.goodsTree.tree;
        },
        // 是否能移动tree item
        canMove: function () {
          if (this.isDefaultView) {
            return false;
          }

          if (this.searchkey) {
            return false;
          }

          return true;
        },
        // 是否能添加组
        canAddGroup: function () {
          if (!this.canMove) {
            return false;
          }

          if (this.addingGroup) {
            return false;
          }

          return true;
        },
        // 是否在添加中
        addingGroup: function () {
          // 没保存的新增组没有ID
          return Boolean(_.find(this.groupOfCurrentView, function (item) {
            return !item.ID;
          }));
        },

        allowAddGoods: function () {
          var status = this.selectedGroup.length > 0 && !this.isDefaultView;

          return status;
        }
      },

      watch: {
        allowAddGoods: function (val) {
          this.$emit('allow-goods-status-change', val);
        }
      },

      data: function () {
        return {
          // 当前视图信息
          currentView: null,
          // 当前视图的分组及其下商品
          groupOfCurrentView: [],

          dataProps: {
            children: 'Goods',
            label: 'Name'
          },
          // 搜索
          searchkey: null,

          addGroupLoading: false,

          selectedGroup: [],

          selectedGoods: [],

          sortSaving: false,
          
          cardStyleDialog: false,

          currentNode: {},

          currentCardStyle: null,

          defaultCardStyles: '#00B75B',

          cardStyles: {
            '#00B75B': {
              backgroundColor: '#00B75B',
              color: '#fff'
            },
            '#FF9900': {
              backgroundColor: '#FF9900',
              color: '#fff'
            },
            '#F04134': {
              backgroundColor: '#F04134',
              color: '#fff'
            },
          }
        };
      },

      methods: {
        addGoodsToGroup: function (goods) {
          var self = this;

          if (self.selectedGroup.length < 1) {
            return;
          }

          return goodsGroup
                  .JoinGoodsGrop({
                    Groups: self.selectedGroup,
                    Goods: _.map(goods, function (item) {
                      return item.GoodsID;
                    })
                  })
                  .then(function (res) {
                    self.$message({
                      message: '商品已添加到选中分组',
                      type: 'success'
                    });
                    self.resetChecked();
                    self.fetchGroupOfCurrentView(self.currentView);
                    return true;
                  }, function () {
                    return false;
                  });
        },

        removeGoodsOrGroupByView: function () {
          var self = this;

          return this.$confirm('此操作将同时移除分组及其所展示的商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function () {
            goodsGroup
              .DeleteGoodsGroup({
                ViewIDs: self.selectedGroup,
                GoodsShowIDs: self.selectedGoods
              })
              .then(function () {
                self.fetchGroupOfCurrentView(self.currentView);
                return true;
              });
          });
        },

        fetchGroupOfCurrentView: function (view) {
          if (!view) {
            return;
          }

          this.$refs.goodsTree.clearSearch();

          this.currentView = view;

          var self = this;
          goodsGroup
            .GetSaleGoods({
              ViewID: view.ID
            })
            .then(function (res) {
              self.groupOfCurrentView = res.Data;
            })
        },

        exchangePlace: function (arr, x, y) {
          var temp = _.assign({}, arr[x]);
          this.$set(arr, x, arr[y]);
          this.$set(arr, y, temp);
        },

        moveUpOfGroup: function (node) {
          var currentIndex = this.groupOfCurrentView.indexOf(node);
          if (currentIndex <= 0) {
            return;
          }

          this.exchangePlace(
            this.groupOfCurrentView,
            currentIndex - 1, currentIndex
          );
        },

        moveDownOfGroup: function (node) {
          var currentIndex = this.groupOfCurrentView.indexOf(node);
          if (
            currentIndex === this.groupOfCurrentView.length - 1
            || currentIndex === -1) {
            return;
          }

          this.exchangePlace(
            this.groupOfCurrentView,
            currentIndex + 1, currentIndex
          );
        },

        findGoodsOfGroup: function (goodsNode) {
          var groupNode = _.find(
            this.groupOfCurrentView,
            function (item) {
              return item.ID === goodsNode.GroupID;
            }
          );

          return groupNode || this.groupOfCurrentView[0];
        },

        moveUpOfGoods: function (node) {
          var groupNode = this.findGoodsOfGroup(node);
          var index = groupNode.Goods.indexOf(node);

          if (index <= 0) {
            return;
          }

          this.exchangePlace(groupNode.Goods, index - 1, index);
        },

        moveDownOfGoods: function (node) {
          var groupNode = this.findGoodsOfGroup(node);
          var index = groupNode.Goods.indexOf(node);

          if (index === groupNode.Goods.length - 1 || index === -1) {
            return;
          }

          this.exchangePlace(groupNode.Goods, index + 1, index);
        },

        moveNode: function (type) {
          var node = this.treeInstance.getCurrentNode() || {};
          var isGroup = node.Goods ? true : false;
          if (type === 'up') {
            isGroup ? this.moveUpOfGroup(node) : this.moveUpOfGoods(node);
          } else if (type === 'down') {
            isGroup ? this.moveDownOfGroup(node) : this.moveDownOfGoods(node);
          }
        },

        addGroup: function () {
          this.groupOfCurrentView.push({
            Goods: [],
            Name: '',
            ID: ''
          });
        },

        renderTreeItemContent: function (h, item) {
          var self = this,
            node = item.node,
            data = item.data;

          if (!data.ID) {
            return h('span', {}, [
              h('el-input', {
                ref: 'addGroupInput',
                props: {
                  size: 'mini',
                  value: data.Name,
                  disabled: this.addGroupLoading
                },

                on: {
                  input: function (val) {
                    data.Name = val;
                  }
                },
                nativeOn: {
                  keydown: function (event) {
                    if (event.keyCode !== 13) {
                      return;
                    }
                    self.commitNewGroupInfo(data);
                  }
                }
              }, [
                  h('i', {
                    slot: 'suffix',
                    class: [
                      'el-input__icon',
                      'color-primary',
                      this.addGroupLoading ? 'el-icon-loading' : 'el-icon-check'
                    ],
                    on: {
                      click: function () {
                        self.commitNewGroupInfo(data);
                      }
                    }
                  })
                ])
            ]);
          }

          return h('span', {
            class: ['single-ellipsis'],
            style: {
              maxWidth: '90%'
            },
            domProps: {
              textContent: data.Name
            }
          });
        },

        commitNewGroupInfo: function (item) {
          if (!item.Name) {
            return this.$message({
              message: '商品分组名称不能为空！',
              type: 'error'
            });
          }

          var self = this;

          this.addGroupLoading = true;

          goodsGroup
            .AddGoodsGroup({
              Name: item.Name,
              RootID: this.currentView.ID,
              OrderBy: this.groupOfCurrentView.length
            })
            .then(function (res) {
              self.addGroupLoading = false;
              item.ID = res.ID;
            }, function () {
              self.addGroupLoading = false;
            }).catch(function () {
              self.addGroupLoading = false;
            });
        },

        handleCheckChangeOfGroup: function (node, isChecked) {
          var index = this.selectedGroup.indexOf(node.ID);

          if (isChecked) {
            (index < 0) && this.selectedGroup.push(node.ID);
          } else {
            (index > -1) && this.selectedGroup.splice(index, 1);
          }
        },

        handleCheckChangeOfGoods: function (node, isChecked) {
          var index = this.selectedGoods.indexOf(node.ID);

          if (isChecked) {
            (index < 0) && this.selectedGoods.push(node.ID);
          } else {
            (index > -1) && this.selectedGoods.splice(index, 1);
          }
        },

        handleTreeCheckChange: function (node, isChecked) {
          var fn = node.Goods ? this.handleCheckChangeOfGroup : this.handleCheckChangeOfGoods;

          fn(node, isChecked);

          this.canDelete();
        },

        canDelete: function () {
          var can = this.selectedGroup.length > 0 || this.selectedGoods.length > 0;

          this.$emit('delete-status-change', can);
        },

        saveGoodsOfView: function () {
          var self = this;
          var currentView = self.currentView || {};
          if (!currentView.ID) {
            return;
          }
          // 修改保存按钮状态
          self.sortSaving = true;

          var commitGroups = _.map(
            self.groupOfCurrentView,
            function (item) {
              var goodsShowID = _.map(item.Goods, function (goods) {
                return goods.ID;
              });

              return {
                ID: item.ID,
                GoodsShow: goodsShowID
              };
            }
          );

          goodsGroup
            .GoodsShowOrderBy({
              ViewID: currentView.ID,
              Groups: commitGroups
            })
            .then(function () {
              self.sortSaving = false;
            }, function () {
              self.sortSaving = false;
            }).catch(function () {
              self.sortSaving = false;
            })
        },

        resetChecked: function () {
          this.$refs.goodsTree.tree.setCheckedKeys([]);
        },

        handleCurrentChange: function (arg) {
          var data = arg[0],
              node = arg[1];
          this.currentNode = node;
        },

        getCardStyles: function (bgColor) {
          bgColor = bgColor || this.defaultCardStyles;

          return this.cardStyles[bgColor] || {};
        },

        setGoodsGroupColor: function() {
          var self = this;
          var styles = this.getCardStyles(this.currentCardStyle);
          goodsGroup.
            UpdateGoodsColor({
              ID: this.currentNode.data.ID,
              FontColor: styles.color,
              BgColor: styles.backgroundColor
            })
            .then(function() {
              self.cardStyleDialog = false;
              self.$message({
                message: '商品分组样式更新成功！',
                type: 'success'
              });
              _.assign(self.currentNode.data, {
                FontColor: styles.color,
                BgColor: styles.backgroundColor
              });
            });
        }
      },

      template: `
      <div class="goods-view-setting">
        <el-container>
          <el-main class="goods-view-setting__main">
            <div class="goods-view-setting__left">
              <center>收银台视图设置</center>
              <el-card 
                shadow="never"
                class="goods-view-setting__container"
                :body-style="{
                    'padding': '0'
                }">

                <view-dropdown 
                  slot="header"
                  @change="fetchGroupOfCurrentView">
                </view-dropdown>

                <ych-tree
                  ref="goodsTree"
                  node-key="ID"
                  @search-change="searchkey = arguments[0]"
                  @check-change="handleTreeCheckChange"
                  @current-change="handleCurrentChange"
                  :data="groupOfCurrentView"
                  :data-props="dataProps"
                  :show-checkbox="!isDefaultView"
                  search-placeholder="搜索商品名称"
                  :show-menu="false"
                  :check-strictly="true"
                  :render-content="renderTreeItemContent">
                </ych-tree>

                <div class="goods-view-setting__left-footer">
                  <el-button
                    @click="saveGoodsOfView"
                    :loading="sortSaving"
                    size="mini">
                    保存排序
                  </el-button>
                </div>
              </el-card>
            </div>
            
            <div class="goods-view-setting__right">
              <el-button 
                @click="moveNode('up')"
                :disabled="!canMove"
                size="mini"
                icon="el-icon-back" 
                type="primary">
              </el-button>
              <el-button 
                @click="moveNode('down')"
                :disabled="!canMove"
                size="mini"
                icon="el-icon-back" 
                type="primary">
              </el-button>
            </div>
          </el-main>
          <el-footer class="goods-view-setting__footer">
            <el-button 
              @click="cardStyleDialog = true"
              :disabled="currentNode.level !== 1 || isDefaultView"
              size="mini"
              type="primary">
              卡片样式设置
            </el-button>
            <el-button 
              @click="addGroup"
              :disabled="!canAddGroup"
              size="mini"
              type="primary">
              新增分组
            </el-button>
          </el-footer>
        </el-container>
        
        <el-dialog
          title="选择收银台菜单卡片样式"
          :visible.sync="cardStyleDialog"
          width="400px">
            <el-row :gutter="20" style="padding-top: 10px">
                <el-col 
                  v-for="(item, key) in cardStyles" 
                  :key="key"
                  :span="8">
                  <el-radio
                    v-model="currentCardStyle" 
                    class="goods-view-setting__radio"
                    :label="key">
                    <span 
                      class="goods-view-setting__goods-card"
                      :style="{
                        'background-color': item.backgroundColor,
                        'color': item.color
                      }">
                      <span>商品名称</span>
                      <span>￥100000</span>
                    </span>
                  </el-radio>
                </el-col>
                
            </el-row>
          <span slot="footer">
            <ych-button @click="cardStyleDialog = false">取 消</ych-button>
            <ych-button type="primary" @click="setGoodsGroupColor">确 定</ych-button>
          </span>
        </el-dialog>
      </div>
    `
    }
  });
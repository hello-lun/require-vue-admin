define([
  'components/cascader-goods-class/index',
  'api/goods/v1/Goods',
], function(
  goodsClass,
  goods
) {
  'use strict';

  return {
    name: 'GoodsSaleViewGoodsList',

    components: {
      GoodsClass: goodsClass
    },

    created: function () {
      this.fetchGoodsListByClass();
    },

    watch: {
      selectedClass: function (val) {
        this.fetchGoodsListByClass(_.last(val));
      }
    },

    data: function () {
      return {
        selectedClass: [''],
        goodsList: [],
        goodsListDataProps: {
          children: 'children',
          label: 'Name'
        },
        selectedGoods: []
      };
    },

    methods: {
      fetchGoodsListByClass: function (classId) {
        var self = this;
        
        goods
          .SearchGoodsByClass({
            ClassID: classId || null
          })
          .then(function (data) {
            self.goodsList = data.Data;
          });
      },

      handleNodeClick: function (data, node, instance) {
        var index = this.selectedGoods.indexOf(data.ID);

        this.$refs.goodsTree.tree.setChecked(data.ID, index < 0);
      },

      handleTreeCheckChange: function (node, isChecked) {
        var index = this.selectedGoods.indexOf(node.ID);

        if (index > -1) {
          isChecked || this.selectedGoods.splice(index, 1);
        } else {
          isChecked && this.selectedGoods.push(node.ID);
        }
        this.$emit('check-change', this.selectedGoods.length !== 0);
      },

      getCheckedGoods: function () {
        var checkedGooods = [];
        var self = this;
        _.forEach(this.goodsList, function (item) {
          if (self.selectedGoods.indexOf(item.ID) > -1) {
            checkedGooods.push({
              GoodsID: item.ID,
              Name: item.Name
            });
          }
        });

        return checkedGooods;
      },

      resetChecked: function () {
        this.$refs.goodsTree.tree.setCheckedKeys([]);
      }
    },

    template: `
      <div class="goods-sale-view__goods-list">
        <center>商品列表</center>
        <el-card 
          shadow="never"
          class="goods-sale-view__container"
          :body-style="{
              'padding': '0'
          }">

          <goods-class 
            v-model="selectedClass"
            slot="header"
            class="goods-sale-view__class"
            size="small"
            :is-all="true"
            :filterable="false"
            :clearable="false">
          </goods-class>

          <ych-tree
            ref="goodsTree"
            @node-click="handleNodeClick"
            @check-change="handleTreeCheckChange"
            node-key="ID"
            :data="goodsList"
            :data-props="goodsListDataProps"
            :show-checkbox="true"
            search-placeholder="输入商品名称"
            :highlight-current="false"
            :show-menu="false">
          </ych-tree>

        </el-card>
      </div>
    `
  }
});
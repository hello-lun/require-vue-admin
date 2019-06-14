define([
  'goods/components/goods-sale-view/goods-list',
  'goods/components/goods-sale-view/view-setting',
  'incss!goods/components/goods-sale-view/styles/index.css'
], function(
  goodsListContainer,
  viewSetting
) {
  'use strict';

  return {
    name: 'GoodsSaleView',

    components: {
      'GoodsList': goodsListContainer,
      'ViewSetting': viewSetting
    },

    data: function () {
      
      return {
        deleteBtnDisabled: true,
        adding: false,
        deletting: false,

        isSelectedGoods: false,
        allowAddGoodsStatusOfView: false
      };
    },

    computed: {
      allowAddGoodsToView: function () {
        return this.isSelectedGoods && this.allowAddGoodsStatusOfView;
      }
    },

    methods: {
      handleAddClick: function () {
        var goodsList = this.$refs.goodsList.getCheckedGoods();
        var self = this;

        this.adding = true;
        this.$refs
          .viewSetting.
          addGoodsToGroup(goodsList)
          .then(function (status) {
            self.adding = false;
            self.$refs.goodsList.resetChecked();
          })
          .catch(function () {
            self.adding = false;
          });
      },

      deleteGoodsOrGroup: function () {
        var self = this;

        self.deletting = true;
        this.$refs.viewSetting.removeGoodsOrGroupByView()
          .then(function () {
            self.deletting = false;
            self.deleteBtnDisabled = true;
          }, function () {
            self.deletting = false;
          })
          .catch(function () {
            self.deletting = false;
          });
      }
    },

    template: `
      <div class="goods-sale-view">
        <el-row 
          type="flex"
          :gutter="40"
          class="goods-sale-view__row">
          <el-col :span="9">
            <goods-list 
              ref="goodsList"
              @check-change="isSelectedGoods = arguments[0]">
            </goods-list>
          </el-col>
          <el-col 
            class="goods-sale-view__operation-btn" 
            :span="4">
            <el-row>
              <el-button 
                @click="handleAddClick"
                :disabled="!allowAddGoodsToView"
                :loading="adding"
                size="mini" 
                style="width: 100%;" 
                type="primary">
                添加
                <i class="el-icon-d-arrow-right"></i>
              </el-button>
            </el-row>
            <el-row>
              <el-button 
                @click="deleteGoodsOrGroup"
                size="mini" 
                style="width: 100%;" 
                type="danger"
                :loading="deletting"
                :disabled="deleteBtnDisabled">
                删除
              </el-button>
            </el-row>
          </el-col>
          <el-col :span="11">
            <view-setting 
              ref="viewSetting"
              @allow-goods-status-change="allowAddGoodsStatusOfView = arguments[0]"
              @delete-status-change="deleteBtnDisabled = !arguments[0]">
            </view-setting>
          </el-col>
        </el-row>
       
      </div>
    `
  };
  
});
define([
], function () {
  'use strict';

  return {
    name: 'ElementList',

    props: {
      value: String
    },

    data: function () {
      return {
        ticketElementList: {
          'qrcode': {
            label: '验票二维码',
            icon: 'el-icon-menu',
            type: 'Rect'
          },
  
          'ticket-price': {
            label: '票价',
            icon: 'el-icon-menu',
            type: 'Text',
            text: '票价: ￥100.00'
          },
  
          'ticket-name': {
            label: '票名',
            icon: 'el-icon-menu',
            type: 'Text',
            text: '票名: 淘气堡游乐套票'
          },
          'print-time': {
            label: '出票时间',
            icon: 'el-icon-menu',
            type: 'Text',
            text: '出票时间: 2018-10-10 12:12:12'
          },
          'expiry-date': {
            label: '有效期',
            icon: 'el-icon-menu',
            type: 'Text',
            text: '有效期: 2018-10-11 至 2019-10-11'
          },
          'remark': {
            label: '备注信息',
            icon: 'el-icon-menu',
            type: 'ITextbox',
            text: '备注信息: 很长很长很长很长 很长很长很长很长 很长很长很长 很长很长很长很长很长很长很长'
          },
          'order-number': {
            label: '订单号',
            icon: 'el-icon-menu',
            type: 'Text',
            text: '订单号: YCH' + Date.parse(new Date())
          },
          'serial-number': {
            label: '序号',
            icon: 'el-icon-menu',
            type: 'Text',
            text: '序号: ' + _.random(100, 1000)
          },
          'image': {
            label: '图片',
            icon: 'el-icon-menu',
            type: 'Image',
          }
        }
      };
    },

    methods: {
      handleElementMenuSelected: function (val) {
        this.$emit('input', val);
        this.$emit('select', val, this.ticketElementList[val] || null);
      }
    },

    template: `
      <el-aside width="150px">
        <el-menu
          :default-active="value"
          @select="handleElementMenuSelected"
          class="ticket-layout-manager__element-list">

          <el-menu-item
            v-for="(item, key) in ticketElementList"
            :key="key"
            :index="key">
            <i :class="item.icon"></i>
            <span slot="title"> {{ item.label }} </span>
          </el-menu-item>

        </el-menu>
      </el-aside>
    `
  }
});
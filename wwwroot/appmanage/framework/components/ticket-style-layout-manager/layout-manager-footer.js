define([
  'api/ticket/v1/Ticket'
], function(
  Ticket
) {
  'use strict';
  
  return {
    name: 'LayoutManagerFooter',

    props: {
      value: String,
    },

    created: function () {
      this.fetchPrintStyleList();
    },

    data: function () {
      return {
        list: []
      };
    },

    methods: {
      update: function () {
        this.fetchPrintStyleList();
      },

      fetchPrintStyleList: function () {
        var self = this;
        Ticket
          .GetPrintStyleList()
          .then(function (res) {
            self.list = res.Data;
          });
      }
    },

    template: `
      <el-row>
        <el-button 
          @click="$emit('input', null)"
          :size="null" plain 
          icon="el-icon-plus"></el-button>
        <el-button 
          v-for="item in list" 
          :key="item.ID"
          @click="$emit('input', item.ID)"
          :class="{
            'ticket-layout-manager__styles-item--selected': (value === item.ID)
          }"
          type="primary"
          :size="null" 
          plain>
          {{ item.Name }}
        </el-button>
      </el-row>
    `
  }
});
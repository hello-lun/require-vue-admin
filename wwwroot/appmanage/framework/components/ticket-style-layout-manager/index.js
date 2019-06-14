define([
  'components/ticket-style-layout-manager/layout-manager'
], function(
  layoutManager
) {
  'use strict';
  
  return {
    name: 'TicketStyleLayoutManager',

    components: {
      LayoutManager: layoutManager
    },

    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },

    data: function () {
      return {
       
      };
    },

    computed: {
      localVisible: {
        get: function () {
          return this.visible;
        },

        set: function (val) {
          this.$emit('update:visible', val);
        }
      }
    },

    template: `
      <el-dialog
        title="编辑打印样式"
        :modal-append-to-body="false"
        :visible.sync="localVisible"
        width="800px"
        :close-on-click-modal="false"
        :close-on-press-escape="false">

        <layout-manager></layout-manager>

      </el-dialog>
    `
  }
});
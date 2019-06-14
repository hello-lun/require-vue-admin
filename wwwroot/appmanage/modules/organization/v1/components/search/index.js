define([
], function() {
  'use strict';
  
  return {
    name: 'Search',

    props: {
      value: String
    },

    computed: {
      localValue: {
        get: function () {
          return this.value;
        },
        set: function (val) {
          this.$emit('input', val);
        }
      }
    },

    template: `
      <div class="search-input">
        <el-input
          v-model="localValue"
          size="mini"
          placeholder="搜索系统功能"
          clearable>
          <i 
            slot="suffix" 
            class="search-icon el-icon-search">
          </i>
        </el-input>
      </div>
    `
  }
});
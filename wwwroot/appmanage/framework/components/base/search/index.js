define([
  'incss!framework/components/base/search/index.css'
], function () {
  'use strict';

  var Search = {
    name: 'Search',

    props: {
      value: String,

      placeholder: {
        type: String,
        default: '搜索系统功能'
      }
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
          :placeholder="placeholder"
          clearable>
          <i 
            slot="suffix" 
            class="search-icon el-icon-search">
          </i>
        </el-input>
      </div>
    `
  }

  Search.install = function (Vue) {
    Vue.component(Search.name, Search);
  };

  return Search;
});
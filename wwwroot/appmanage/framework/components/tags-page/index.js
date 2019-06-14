define(function() {
  'use strict';

  var pageIndex = 'workbentch';

  return {
    name: 'PageTags',

    props: {
      value: {
        type: String,
        default: 'workbentch'
      },
      openedPage: Array,
    },

    methods: {
      handleTagClick: function (name) {
        this.$emit('input', name);
      },

      closeSingleTag: function (name) {
        this.$emit('close-single', name);
      },

      // 关闭tab指令
      handleCloseCommand: function (command) {
        this.$emit('close-tags', command);
      }
    },

    template: `
      <div class="page-tags">
        <div class="tags-container">
          <el-tag 
            v-for="(item, index) in openedPage"
            @click.native="handleTagClick(item.Path)"
            @close="closeSingleTag(item.Path)"
            :key="item.Path"
            :class="{'active': value === item.Path}"
            :closable="index !== 0">
            <i class="icon-circle"></i>
            {{ item.Title }}
          </el-tag>
        </div>

        <el-dropdown 
          @command="handleCloseCommand"
          size="small" 
          class="close-all">
          <el-button 
            icon="el-icon-caret-bottom"
            plain>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
            <el-dropdown-item command="other" divided>关闭其它</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    `
  }
});
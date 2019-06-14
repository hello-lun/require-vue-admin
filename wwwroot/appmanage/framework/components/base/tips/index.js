define([
  'incss!components/base/tips/styles/index.css'
], function () {
  'use strict';

  var Tips = {
    name: 'YchTips',

    props: {
      content: String
    },

    template: `
      <div class="ych-tips">
        <el-tooltip placement="top">
          <div slot="content">
            <span v-html="content"></span>
          </div>
          <i class="el-icon-question"></i>
        </el-tooltip>
      </div>
    `
  }

  Tips.install = function (Vue) {
    Vue.component(Tips.name, Tips);
  };

  return Tips;
});

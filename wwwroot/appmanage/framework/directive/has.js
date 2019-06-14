define([
  'util/tool'
], function (tool) {
  'use strict';
  /**
   * v-has 用于判断用户权限
   * 
   * @example <div v-has="['goods']"></div>
   *  值支持String / Array
   */
  return {
    name: 'has',
    achieve: {
      bind: function (el, binding) {
        var valid = false;
        if (typeof binding.value === 'array') {
          for (var i = 0, len = binding.value.length; i < len; i++) {
            var item = binding.value[i];
            valid = tool.hasPermission(item);
  
            if (valid) break;
          }
        } else {
          valid = tool.hasPermission(binding.value);
        }
        valid || el.parentNode.removeChild(el);
      }
    }
  }
});
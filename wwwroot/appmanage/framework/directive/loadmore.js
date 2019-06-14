define([], function () {
  'use strict';

  var binding = null;

  var bindFn = function () {
    var sign = binding.arg || 100;
    var scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
    if (scrollDistance <= sign) {
      binding.value()
    }
  };

  return {
    name: 'loadmore',
    achieve: {
      bind: function (el, _binding) {
        binding = _binding;
        var selectWrap = el.querySelector('.el-table__body-wrapper');
        selectWrap.addEventListener('scroll', bindFn);
      },

      unbind: function (el) {
        var selectWrap = el.querySelector('.el-table__body-wrapper');
        selectWrap.removeEventListener('scroll', bindFn);
      }
    }
  }
});